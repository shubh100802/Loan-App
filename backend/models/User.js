import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  dob: { type: String, default: "" },
  address: { type: String, default: "" },
  employmentStatus: { type: String, default: "" },
  company: { type: String, default: "" },
  jobTitle: { type: String, default: "" },
  monthlyIncome: { type: Number, default: 0 },
  profilePic: { type: String, default: "" },

  documents: [
    {
      filename: { type: String },
      originalname: { type: String },
      mimetype: { type: String },
      size: { type: Number },
      uploadedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });


export default mongoose.model("User", userSchema);
