import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: "admin" }
});

export default mongoose.model("Admin", adminSchema);
