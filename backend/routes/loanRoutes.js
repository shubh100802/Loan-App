// backend/routes/loanRoutes.js
import express from "express";
import {
  getLoans,
  getLoan,
  createLoan,
  updateLoan,
  deleteLoan
} from "../controllers/loanController.js";

import { protect } from "../middleware/authMiddleware.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public GET (you can protect if you want users to be logged in)
router.get("/", getLoans);

// single loan
router.get("/:id", getLoan);

// admin-only CRUD
router.post("/", protect, protectAdmin, createLoan);
router.put("/:id", protect, protectAdmin, updateLoan);
router.delete("/:id", protect, protectAdmin, deleteLoan);

export default router;
