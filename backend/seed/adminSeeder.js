import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

dotenv.config();

const admins = [
  {
    username: "Shubh123",
    password: "Shubh@1008",
    role: "admin",
  },
  {
    username: "Anu1608",
    password: "AnujitaRiya@1608",
    role: "admin",
  },
  // ⭐ Add more admins anytime here:
  // { username: "NewAdmin", password: "NewPass123", role: "admin" }
];

const createAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const admin of admins) {
      const existing = await Admin.findOne({ username: admin.username });
      if (existing) {
        console.log(`⚠️ Admin '${admin.username}' already exists. Skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(admin.password, 10);

      await Admin.create({
        username: admin.username,
        password: hashedPassword,
        role: admin.role || "admin",
      });

      console.log(`✅ Admin created: ${admin.username}`);
    }

    console.log("🎉 All admin seeding completed!");
    process.exit(0);
  } catch (err) {
    console.log("❌ Error creating admins:", err);
    process.exit(1);
  }
};

createAdmins();
