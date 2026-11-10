import asyncHandler from "express-async-handler"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const availUser = await User.findOne({ email });

    if (availUser) {
        res.status(400);
        throw new Error("User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        role: "user",
        hashedPassword: hashed
    });

    res.status(201).json({
        message: "User created successfully"
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Some fields are missing");
    }

    const user = await User.findOne({ email });

    if (user) {
        const isMatch = await bcrypt.compare(password, user.hashedPassword);

        if (!isMatch) {
            res.status(400);
            throw new Error("Invalid Password");
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
});

        res.json({ message: "Login Success" });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
})

export const logoutuser = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });
    return res.status(200).json({
        success:true,
        message: "Logged out"
    });
})

export const currentUser = asyncHandler(async (req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false,message: "User not found" });
        }

        res.status(200).json({
            success:true,
            id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
})
