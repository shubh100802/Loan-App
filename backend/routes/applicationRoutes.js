import express from "express";
import {
    createApplication,
    getApplications,
    getApplication,
    getAllApplications,
    deleteApplication
} from "../controllers/applicationController.js";


import { protect } from "../middleware/authMiddleware.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// =============================
// ADMIN ROUTES 
// =============================
router.get("/admin/all", protectAdmin, getAllApplications);
router.get("/admin/:id", protectAdmin, getApplication);
router.delete("/admin/:id", protectAdmin, deleteApplication);


// =============================
// USER ROUTES 
// =============================
router.post("/", protect, createApplication);
router.get("/", protect, getApplications);
router.get("/:id", protect, getApplication);

export default router;
