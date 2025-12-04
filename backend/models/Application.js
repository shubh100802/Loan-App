// backend/models/Application.js
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String
}, { _id: false });

const PersonalSchema = new mongoose.Schema({
  fullName: String,
  fatherName: String,
  age: Number,
  dob: String,
  gender: String,
  email: String,
  phone: String,
  currentAddress: AddressSchema,
  permanentAddress: AddressSchema
}, { _id: false });


const EmploymentSchema = new mongoose.Schema({
  employmentType: String,
  companyName: String,
  companyEmail: String,
  role: String,
  income: Number,
  currentEmi: Number,
  creditObligation: Number
}, { _id: false });

const ReferenceSchema = new mongoose.Schema({
  name: String,
  relationship: String,
  phone: String,
  address: String
}, { _id: false });



const DocumentSchema = new mongoose.Schema({
  pan: String,
  aadhaarFront: String,
  aadhaarBack: String,
  addressProof: String,
  salarySlip1: String,
  salarySlip2: String,
  salarySlip3: String,
  salarySlip1Password: String,
  salarySlip2Password: String,
  salarySlip3Password: String,
  bankStatement1: String,
  bankStatement2: String,
  bankStatement3: String,
  bankStatement1Password: String,
  bankStatement2Password: String,
  bankStatement3Password: String,
  photo: String
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
  reference: {
    ref1: ReferenceSchema,
    ref2: ReferenceSchema
  },
  documents: DocumentSchema,
  status: { 
  type: String, 
  enum: ["draft", "submitted", "pending", "in review", "approved", "rejected"], 
  default: "submitted" 
},
  meta: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
export default Application;
