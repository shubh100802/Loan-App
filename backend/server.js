import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Configure dotenv
dotenv.config();

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: [
        "http://127.0.0.1:5500", 
        "http://localhost:5500",
        "http://localhost:3000"
    ],
    credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/user", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/applications", applicationRoutes);
app.use("/api/upload", uploadRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '..')));
    
    // Handle React routing, return all requests to index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'index.html'));
    });
} else {
    // Default route for development
    app.get("/", (req, res) => {
        res.send("Loan App Backend is running in development mode...");
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on PORT ${PORT}`);
});
