
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, msg: "Not authenticated" });
  }


  if (req.user.role && req.user.role === "admin") {
    return next();
  }

  // if you used isAdmin boolean:
  if (req.user.isAdmin) {
    return next();
  }

  return res.status(403).json({ success: false, msg: "Admin access required" });
});

export const protectAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, msg: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, msg: "Admin access denied" });
    }


    req.admin = decoded;
    req.user = decoded;

    next();
  } catch (err) {
    console.log("ADMIN ERROR:", err);
    return res.status(401).json({ success: false, msg: "Invalid admin token" });
  }
};


export default adminMiddleware;
