import express from "express";
import { register, resendOtp, verifyOtp, login, forgotPassword, resetPassword, verifyResetOtp } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/resend-otp
router.post("/resend-otp", resendOtp);

// POST /api/auth/verify-otp
router.post("/verify-otp", verifyOtp);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

// POST /api/auth/verify-reset-otp
router.post("/verify-reset-otp", verifyResetOtp);

export default router;
