import User from "../models/User.js";
import Problem from "../models/Problem.js";
import asyncHandler from "express-async-handler"


export const postQuestion = asyncHandler(async (req, res) => {
    const {
        title, slug, desc, difficulty, tags, constraints, examples, startcode, testcases, timelimit
    } = req.body;

    if (!title || !slug) {
        res.status(400);
        throw new Error("Required fields are missing");
    }

    const existingProblem = await Problem.findOne({ slug });

    if (existingProblem) {
        res.status(400);
        throw new Error("Problem already exists");
    }

    const problem = await Problem.create({
        title,
        slug,
        desc, 
        difficulty, 
        tags, 
        constraints, 
        examples, 
        startcode, 
        testcases, 
        timelimit
    });

    res.status(201).json({
        message: "Problem created successfully",
        problem
    });
});

export const titles = async (req, res) => {
    try {
        const problems = await Problem.find({}).select("title slug _id").lean();

        return res.status(200).json({
            success: true,
            count: problems.length,
            data: problems,
        });
    } catch (error) {
        console.error("Error fetching problem titles:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching problem titles",
        });
    }
};

export const getProblemBySlug = asyncHandler(async(req, res) => {
    try {
      const problem = await Problem.findOne({ slug: req.params.slug })
        .select("-testcases") // don't send the test cases to the browser
        .lean();
  
      if (!problem) {
        return res.status(404).json({ success: false, message: "Problem not found" });
      }
  
      return res.status(200).json({ success: true, data: problem });
    } catch (error) {
      console.error("Error fetching problem:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });