import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const adminLogin = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    // Check if both fields exist
    if (!adminId || !password) {
      return res.status(400).json({ msg: "Please enter adminId and password" });
    }

    // Find admin by username (adminId = username)
    const admin = await Admin.findOne({ username: adminId });

    if (!admin) {
      return res.status(400).json({ msg: "Admin not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    console.log("Admin login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAllUsers = asyncHandler(async (req, res) => {

  const users = await User.find({}, "name email mobile isVerified called createdAt").sort({ createdAt: -1 });
  res.json({ success: true, users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      msg: "User not found"
    });
  }

  res.json({
    success: true,
    user
  });
});


export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, msg: "User not found" });

  const { name, email, mobile, isVerified, called } = req.body;

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (mobile !== undefined) user.mobile = mobile;
  if (isVerified !== undefined) user.isVerified = isVerified;
  if (called !== undefined) user.called = called;
  await user.save();
  res.json({ success: true, msg: "User updated", user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, msg: "User not found" });

  await user.deleteOne();
  res.json({ success: true, msg: "User deleted" });
});


