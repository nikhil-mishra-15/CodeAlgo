import jwt from "jsonwebtoken"
import User from "../models/User.js";

const authorizeadmin = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401);
        throw new Error("Not authorized");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("role");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            res.status(403);
            throw new Error("Admin access required");
        }

    } catch (err) {
        if (err.name === "JsonWebTokenError" ||
            err.name === "TokenExpiredError") {
            res.status(401);
            throw new Error("Invalid or expired token");
        }

        throw err;
    }

}

export default authorizeadmin;