import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import {
    welcomeApplauseEmail,
    passwordChangedEmail,
    passwordResetEmail,
    signupOtpEmail
} from "../utils/emailTemplates.js";


export const register = async (req, res) => {
    try {
        const { name, mobile, email, password } = req.body;

        // Check existing user
        const exists = await User.findOne({ mobile });
        if (exists) {
            return res.status(400).json({ msg: "Mobile number already registered" });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ msg: "Email already registered" });
        }


        // Hash Password
        const hashed = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        const user = await User.create({
            name,
            mobile,
            email,
            password: hashed,
            otp,
            otpExpires: Date.now() + 5 * 60 * 1000,
        });

        // Email Body
        const emailSent = await sendEmail(
            email,
            "🔐 Verify Your Email – MyLoanCredit",
            signupOtpEmail({ name, otp })
        );


        if (!emailSent) {
            return res.status(500).json({ msg: "Failed to send OTP. Please try again or use a verified email." });
        }


        res.json({ success: true, msg: "OTP sent to email", userId: user._id });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        const user = await User.findOne({ mobile });

        if (!user) return res.status(400).json({ success: false, msg: "User not found" });

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, msg: "Invalid OTP" });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, msg: "OTP expired" });
        }

        // Mark verified
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();


        try {
            await sendEmail(
                user.email,
                "🎉 Welcome to MyLoanCredit!",
                welcomeApplauseEmail({ name: user.name })
            );
        } catch (err) {
            console.error("Welcome email failed:", err);
        }



        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({
            success: true,
            msg: "Verification successful",
            token,
            user
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error" });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { mobile } = req.body;

        const user = await User.findOne({ mobile });
        if (!user) return res.status(400).json({ msg: "User not found" });

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendEmail(
            user.email,
            "🔁 New OTP for Email Verification – MyLoanCredit",
            signupOtpEmail({ name: user.name, otp })
        );


        await sendEmail(user.email, "MLC - New OTP", html);

        res.json({ success: true, msg: "New OTP sent" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error" });
    }
};


export const login = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        const user = await User.findOne({ mobile });
        if (!user) return res.status(400).json({ success: false, msg: "User not found" });

        if (!user.isVerified) {
            return res.status(400).json({ success: false, msg: "Please verify OTP first" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ success: false, msg: "Incorrect password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ success: true, token, user });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error" });
    }
};



// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Prevent email enumeration
            return res.json({ success: true, msg: "If email exists, OTP sent" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min
        await user.save();

        await sendEmail(
            user.email,
            "🔐 Password Reset Request – MyLoanCredit",
            passwordResetEmail({ name: user.name, otp })
        );


        res.json({ success: true, msg: "OTP sent to email" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error" });
    }
};


// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({ success: false, msg: "User not found" });

        if (user.otp !== otp)
            return res.status(400).json({ success: false, msg: "Invalid OTP" });

        if (user.otpExpires < Date.now())
            return res.status(400).json({ success: false, msg: "OTP expired" });

        // 🔐 Hash & update password in DB
        user.password = await bcrypt.hash(newPassword, 10);

        // Clear OTP
        user.otp = null;
        user.otpExpires = null;

        await user.save();

        //  Send password changed alert email
        await sendEmail(
            user.email,
            "🔐 Your MyLoanCredit password was changed",
            passwordChangedEmail({ name: user.name })
        );


        res.json({ success: true, msg: "Password reset successful" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error" });
    }
};


// ================= VERIFY RESET OTP =================
export const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                msg: "Invalid or expired OTP"
            });
        }

        return res.json({
            success: true,
            msg: "OTP verified"
        });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};
