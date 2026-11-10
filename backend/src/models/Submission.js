import mongoose from "mongoose";
import User from "./User";

const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },
    language: {
      type: String,
      enum: ["javascript", "python", "cpp"],
      required: true,
    },
    code: { type: String, required: true, maxlength: 50000 },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
        "Runtime Error",
        "Compilation Error",
        "Internal Error",
      ],
      default: "Pending",
      index: true,
    },

    runtime: { type: Number, default: null }, // ms (max across test cases)
    memory: { type: Number, default: null },  // KB (max across test cases)

    // Index of the first failing test case (null if Accepted).
    // For hidden cases, expose only the index to the client, never the input/output.
    failedTestCase: { type: Number, default: null },

    // Useful extras
    passedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    errorMessage: { type: String, default: "" }, // compile/runtime error text
  },
  { timestamps: true } // createdAt, updatedAt
);

// "My submissions for this problem", newest first
submissionSchema.index({ userId: 1, problemId: 1, createdAt: -1 });

export default mongoose.model("Submission", submissionSchema);