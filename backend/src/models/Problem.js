import mongoose from "mongoose";

// Problem: title, slug, description, difficulty, tags[], constraints, examples[], 
// starterCode {js, python, cpp}, testCases[] {input, expectedOutput, isHidden}, timeLimit, memoryLimit
const problemSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },

    desc: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true
    },

    tags: [String],
    constraints: [String],
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],

    startcode: {
        js: String,
        cpp: String,
        python: String,
        java: String
    },

    testcases: [{
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        isHidden: { type: Boolean, default: false }
    }],

    timelimit: {
        type: Number,
        default: 1000
    },

    memorylimit: {
        type: Number,
        default: 256
    }


}, { timestamps: true });

export default mongoose.model("Problem", problemSchema);
