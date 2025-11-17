import fs from "fs";
import path from "path";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -otp -otpExpires");

        res.json({
            success: true,
            user
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const {
            name,
            email,
            mobile,
            dob,
            address,
            employmentStatus,
            company,
            jobTitle,
            monthlyIncome,
            profilePic
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        // Update all fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.mobile = mobile || user.mobile;

        user.dob = dob || user.dob;
        user.address = address || user.address;
        user.employmentStatus = employmentStatus || user.employmentStatus;
        user.company = company || user.company;
        user.jobTitle = jobTitle || user.jobTitle;
        user.monthlyIncome = monthlyIncome || user.monthlyIncome;
        user.profilePic = profilePic || user.profilePic;


        await user.save();

        res.json({
            success: true,
            msg: "Profile updated successfully",
            user
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Server error" });
    }


};

export const updateProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, msg: "No file uploaded" });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, msg: "User not found" });


        user.profilePic = req.file.filename;
        await user.save();

        res.json({
            success: true,
            msg: "Profile picture updated successfully",
            file: req.file.filename
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Server Error" });
    }
};


// ----------------- Upload Document -----------------
export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, msg: "No file uploaded" });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, msg: "User not found" });

        const doc = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadedAt: new Date()
        };

        user.documents.push(doc);
        await user.save();

        res.json({ success: true, msg: "Document uploaded", document: doc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

// ----------------- Get Documents List -----------------
export const getDocuments = async (req, res) => {
    try {
        const user = await User.findById(req.user._1 ? req.user._id : req.user._id).select("documents");
        if (!user) return res.status(404).json({ success: false, msg: "User not found" });

        res.json({ success: true, documents: user.documents });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

// ----------------- Download Document -----------------
export const downloadDocument = async (req, res) => {
    try {
        const { id } = req.params; // document subdocument _id
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, msg: "User not found" });

        const doc = user.documents.id(id);
        if (!doc) return res.status(404).json({ success: false, msg: "Document not found" });

        const filePath = path.join(process.cwd(), "uploads", doc.filename);
        if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, msg: "File missing on server" });

        res.download(filePath, doc.originalname);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

// ----------------- Delete Document -----------------

export const deleteDocument = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const doc = user.documents.id(req.params.id);

        if (!doc) {
            return res.status(404).json({ success: false, msg: "Document not found" });
        }

        // Delete file from server
        const filePath = `uploads/documents/${doc.filename}`;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        // DELETE document properly 
        await doc.deleteOne();

        // Save user after modification
        await user.save();

        res.json({ success: true, msg: "Document deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};



