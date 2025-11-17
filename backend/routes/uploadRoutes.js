// backend/routes/uploadRoutes.js
import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js"; // keep if you want auth for uploads

const router = express.Router();

// single document upload
router.post("/document", protect, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, msg: "No file uploaded" });
  }
  // Ensure the server is serving /uploads as static (server.js already does this)
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({ success: true, url: fileUrl, originalName: req.file.originalname });
});

export default router;
