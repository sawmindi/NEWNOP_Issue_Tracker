const { validationResult } = require("express-validator");
const Issue = require("../models/Issue");

// Get all issues (with search, filter, pagination)
// GET /api/issues
const getIssues = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      severity,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    // Text search
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (severity) query.severity = severity;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const [issues, total] = await Promise.all([
      Issue.find(query)
        .populate("reporter", "name email avatar")
        .populate("assignee", "name email avatar")
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Issue.countDocuments(query),
    ]);

    // Status counts (unfiltered)
    const statusCounts = await Issue.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const counts = { Open: 0, "In Progress": 0, Resolved: 0, Closed: 0 };
    statusCounts.forEach(({ _id, count }) => {
      if (counts.hasOwnProperty(_id)) counts[_id] = count;
    });

    res.json({
      success: true,
      data: issues,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      statusCounts: counts,
    });
  } catch (error) {
    next(error);
  }
};

// Get single issue
// GET /api/issues/:id
const getIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reporter", "name email avatar")
      .populate("assignee", "name email avatar");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
};

// Create issue
// POST /api/issues
const createIssue = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const issue = await Issue.create({
      ...req.body,
      reporter: req.user._id,
    });

    await issue.populate("reporter", "name email avatar");

    res.status(201).json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
};

// Update issue
// PUT /api/issues/:id
const updateIssue = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    let issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("reporter", "name email avatar")
      .populate("assignee", "name email avatar");

    res.json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
};

// Delete issue
// DELETE /api/issues/:id
const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Only reporter can delete
    if (issue.reporter.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this issue" });
    }

    await issue.deleteOne();
    res.json({ success: true, message: "Issue deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Update issue status
// PATCH /api/issues/:id/status
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Open", "In Progress", "Resolved", "Closed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    )
      .populate("reporter", "name email avatar")
      .populate("assignee", "name email avatar");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
};

// Export issues to CSV/JSON
// GET /api/issues/export
const exportIssues = async (req, res, next) => {
  try {
    const { format = "json", status, priority } = req.query;
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const issues = await Issue.find(query)
      .populate("reporter", "name email")
      .populate("assignee", "name email")
      .sort({ createdAt: -1 });

    if (format === "csv") {
      const headers = [
        "ID",
        "Title",
        "Status",
        "Priority",
        "Severity",
        "Reporter",
        "Assignee",
        "Created At",
        "Resolved At",
      ];
      const rows = issues.map((i) => [
        i._id,
        `"${i.title.replace(/"/g, '""')}"`,
        i.status,
        i.priority,
        i.severity,
        i.reporter?.name || "",
        i.assignee?.name || "",
        i.createdAt.toISOString(),
        i.resolvedAt ? i.resolvedAt.toISOString() : "",
      ]);

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
        "\n"
      );
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=issues-export.csv"
      );
      return res.send(csv);
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=issues-export.json"
    );
    res.json(issues);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  updateStatus,
  exportIssues,
};
