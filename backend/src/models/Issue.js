const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [3010, "Description cannot be more than 3010 characters"],
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    severity: {
      type: String,
      enum: ["Minor", "Major", "Critical", "Blocker"],
      default: "Minor",
    },
    tags: [{ type: String, trim: true }],
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resolvedAt: { type: Date },
    closedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for efficient queries
issueSchema.index({ title: "text", description: "text" });
issueSchema.index({ status: 1 });
issueSchema.index({ priority: 1 });
issueSchema.index({ reporter: 1 });
issueSchema.index({ createdAt: -1 });

// Auto-set resolved/closed timestamps
issueSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "Resolved" && !this.resolvedAt) {
      this.resolvedAt = new Date();
    }
    if (this.status === "Closed" && !this.closedAt) {
      this.closedAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model("Issue", issueSchema);
