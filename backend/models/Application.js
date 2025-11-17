// backend/models/Application.js
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String
}, { _id: false });

const PersonalSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  dob: String,
  gender: String,
  address: AddressSchema
}, { _id: false });

const EmploymentSchema = new mongoose.Schema({
  employer: String,
  jobTitle: String,
  income: Number,
  employmentType: String
}, { _id: false });

const DocumentSchema = new mongoose.Schema({
  name: String,
  url: String
}, { _id: false });

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // optional if guest
  bankId: { type: String, required: true },
  bankName: { type: String, required: true },
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true },
  loanName: { type: String, required: true },
  loanAmount: { type: Number, required: true, min: 0 },
  loanPurpose: { type: String, required: true, enum: ["Home Purchase", "Home Renovation", "Personal Use", "Education", "Medical", "Business", "Debt Consolidation", "Other"] },
  personal: PersonalSchema,
  employment: EmploymentSchema,
  documents: [DocumentSchema],
  status: { type: String, enum: ["draft","submitted","approved","rejected"], default: "submitted" },
  meta: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
export default Application;
