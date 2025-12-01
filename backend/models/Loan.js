// backend/models/Loan.js
import mongoose from "mongoose";

const EligibilitySchema = new mongoose.Schema({
  cibilRequired: { type: Boolean, default: false },
  incomeProofRequired: { type: Boolean, default: true },
  collateralRequired: { type: Boolean, default: false },
}, { _id: false });

const LoanSchema = new mongoose.Schema({
  bankId: { type: String, required: true },
  bankName: { type: String, required: true },
  bankLogo: { type: String },
  bankType: {
    type: String,
    enum: ["BANK", "NBFC"],
    default: "BANK"
  },


  loanName: { type: String, required: true },
  description: { type: String },

  minInterestRate: { type: Number, required: true },
  maxInterestRate: { type: Number, required: true },

  minProcessingFee: { type: String, required: true },
  maxProcessingFee: { type: String, required: true },

  minLoanAmount: { type: Number, required: true },
  maxLoanAmount: { type: Number, required: true },

  minTenure: { type: Number, required: true }, // months
  maxTenure: { type: Number, required: true }, // months

  eligibility: { type: EligibilitySchema, default: () => ({}) },

  documentsRequired: { type: [String], default: [] },

  status: {
    type: String,
    enum: ["active", "inactive", "coming_soon"],
    default: "active"
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }
}, { timestamps: true });

const Loan = mongoose.models.Loan || mongoose.model("Loan", LoanSchema);
export default Loan;
