import express from "express";
import {
    getProfile, 
    updateProfile, 
    updateProfilePic, 
    uploadDocument,
    getDocuments,
    downloadDocument,
    deleteDocument
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/update-profile", protect, updateProfile);
router.put("/update-profile-pic", protect, upload.single("profilePic"), updateProfilePic);

// Documents

router.post("/upload-document", protect, upload.single("document"), uploadDocument);
router.get("/documents", protect, getDocuments);
router.get("/documents/download/:id", protect, downloadDocument);
router.delete("/documents/:id", protect, deleteDocument);

export default router;
