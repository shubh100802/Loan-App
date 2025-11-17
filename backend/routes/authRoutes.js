import express from "express";
import { register, resendOtp, verifyOtp, login } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/resend-otp
router.post("/resend-otp", resendOtp);

// POST /api/auth/verify-otp
router.post("/verify-otp", verifyOtp);

// POST /api/auth/login
router.post("/login", login);

export default router;
