import express from "express";
import { 
    adminLogin, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser 
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Protected admin routes
router.get("/users", protectAdmin, getAllUsers);
router.get("/users/:id", protectAdmin, getUserById);
router.put("/users/:id", protectAdmin, updateUser);
router.delete("/users/:id", protectAdmin, deleteUser);

export default router;
