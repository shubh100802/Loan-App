// backend/routes/loanRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getLoans,
  getLoan,
  createLoan,
  updateLoan,
  deleteLoan
} from "../controllers/loanController.js";

// ensure uploads directory exists
const logosDir = path.join(process.cwd(), "uploads", "bank-logos");
if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, logosDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|svg|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only images are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});


import { protect } from "../middleware/authMiddleware.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";
import loanController from "../controllers/loanController.js";


const router = express.Router();

// Public GET (you can protect if you want users to be logged in)
router.get("/", getLoans);

// single loan
router.get("/:id", getLoan);

// admin-only CRUD
router.post("/", protect, protectAdmin, createLoan);
router.put("/:id", protect, protectAdmin, updateLoan);
router.delete("/:id", protect, protectAdmin, deleteLoan);
// upload bank logo and update all loans for the bankId
router.post("/upload-bank-logo", upload.single("bankLogo"), loanController.uploadBankLogo);


export default router;
