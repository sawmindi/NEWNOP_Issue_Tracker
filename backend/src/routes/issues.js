const express = require("express");
const { body } = require("express-validator");
const {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  updateStatus,
  exportIssues,
} = require("../controllers/issueController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(protect);

const titleValidation = body("title")
  .trim()
  .notEmpty()
  .withMessage("Title is required")
  .isLength({ max: 200 })
  .withMessage("Title must be under 200 characters");

router.get("/export", exportIssues);
router.get("/", getIssues);
router.post("/", [titleValidation], createIssue);
router.get("/:id", getIssue);
router.put("/:id", [titleValidation], updateIssue);
router.delete("/:id", deleteIssue);
router.patch("/:id/status", updateStatus);

module.exports = router;
