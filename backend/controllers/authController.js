import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

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
        const html = `
            <h2>Your MLC Verification Code</h2>
            <p>Your OTP is:</p>
            <h1 style="font-size:32px; color:#4f46e5;">${otp}</h1>
            <p>This OTP will expire in 5 minutes.</p>
        `;

        const emailSent = await sendEmail(email, "MLC Email Verification", html);

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

        const html = `
            <h2>Your new MLC (myloancredit) OTP</h2>
            <h1 style="font-size:32px; color:#4f46e5;">${otp}</h1>
            <p>Expires in 5 minutes.</p>
        `;

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


