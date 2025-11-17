// backend/controllers/loanController.js
import asyncHandler from "express-async-handler";
import Loan from "../models/Loan.js";

// @desc    Get all loans (optionally filter by bankId)
// @route   GET /api/loans
// @access  protected (or public if you want) - we will leave route protection to routes
export const getLoans = asyncHandler(async (req, res) => {
  const { bank } = req.query;

  const filter = {};
  if (bank) filter.bankId = bank;

  const loans = await Loan.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: loans });
});

// @desc    Get single loan
// @route   GET /api/loans/:id
// @access  protected
export const getLoan = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) return res.status(404).json({ success: false, msg: "Loan not found" });
  res.json({ success: true, data: loan });
});

// @desc    Create new loan type
// @route   POST /api/loans
// @access  admin
export const createLoan = asyncHandler(async (req, res) => {
  const body = req.body;

  // Simple validation
  if (!body.bankId || !body.bankName || !body.loanName) {
    return res.status(400).json({ success: false, msg: "bankId, bankName and loanName are required" });
  }

  // Parse documentsRequired if sent as comma-separated string
  let docs = [];
  if (typeof body.documentsRequired === "string") {
    docs = body.documentsRequired.split(",").map(s => s.trim()).filter(Boolean);
  } else if (Array.isArray(body.documentsRequired)) {
    docs = body.documentsRequired;
  }

  const loan = await Loan.create({
    bankId: body.bankId,
    bankName: body.bankName,
    bankLogo: body.bankLogo || "",
    loanName: body.loanName,
    description: body.description || "",
    minInterestRate: Number(body.minInterestRate) || 0,
    maxInterestRate: Number(body.maxInterestRate) || 0,
    minProcessingFee: Number(body.minProcessingFee) || 0,
    maxProcessingFee: Number(body.maxProcessingFee) || 0,
    minLoanAmount: Number(body.minLoanAmount) || 0,
    maxLoanAmount: Number(body.maxLoanAmount) || 0,
    minTenure: Number(body.minTenure) || 0,
    maxTenure: Number(body.maxTenure) || 0,
    eligibility: {
      cibilRequired: !!body.cibilRequired,
      incomeProofRequired: !!body.incomeProofRequired,
      collateralRequired: !!body.collateralRequired
    },
    documentsRequired: docs,
    status: body.status || "active",
    createdBy: req.user ? req.user._id : undefined
  });

  res.status(201).json({ success: true, data: loan });
});

// @desc    Update loan type
// @route   PUT /api/loans/:id
// @access  admin
export const updateLoan = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) return res.status(404).json({ success: false, msg: "Loan not found" });

  const body = req.body;

  // Update fields (only those provided)
  const up = {};
  const allow = [
    "bankId","bankName","bankLogo","loanName","description",
    "minInterestRate","maxInterestRate","minProcessingFee","maxProcessingFee",
    "minLoanAmount","maxLoanAmount","minTenure","maxTenure","status"
  ];
  allow.forEach(k => {
    if (body[k] !== undefined) up[k] = body[k];
  });

  // eligibility
  up.eligibility = {
    cibilRequired: body.cibilRequired !== undefined ? !!body.cibilRequired : loan.eligibility.cibilRequired,
    incomeProofRequired: body.incomeProofRequired !== undefined ? !!body.incomeProofRequired : loan.eligibility.incomeProofRequired,
    collateralRequired: body.collateralRequired !== undefined ? !!body.collateralRequired : loan.eligibility.collateralRequired
  };

  // documents
  if (body.documentsRequired !== undefined) {
    if (typeof body.documentsRequired === "string") {
      up.documentsRequired = body.documentsRequired.split(",").map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(body.documentsRequired)) {
      up.documentsRequired = body.documentsRequired;
    } else {
      up.documentsRequired = loan.documentsRequired;
    }
  }

  const updated = await Loan.findByIdAndUpdate(req.params.id, { $set: up }, { new: true });
  res.json({ success: true, data: updated });
});

// @desc    Delete loan type
// @route   DELETE /api/loans/:id
// @access  admin
export const deleteLoan = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) return res.status(404).json({ success: false, msg: "Loan not found" });

  await Loan.deleteOne({ _id: req.params.id });
  res.json({ success: true, msg: "Loan deleted" });
});

export default {
  getLoans,
  getLoan,
  createLoan,
  updateLoan,
  deleteLoan
};
