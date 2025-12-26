// backend/controllers/applicationController.js
import asyncHandler from "express-async-handler";
import Application from "../models/Application.js";
import mongoose from "mongoose";


export const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({})
    .sort({ createdAt: -1 })
    .populate('user', 'name email mobile')
    .populate('loanId', 'loanName bankName');

  res.json({ success: true, data: applications });
});


export const createApplication = asyncHandler(async (req, res) => {
  const body = req.body || {};

  // If the client sends a nested 'personal' object (old shape), prefer that as src,
  // otherwise use root-level properties (new shape).
  const srcPersonal = body.personal && typeof body.personal === "object" ? body.personal : null;
  const srcEmployment = body.employment && typeof body.employment === "object" ? body.employment : null;
  const srcDocuments = body.documents && typeof body.documents === "object" ? body.documents : null;

  // Helper to read either from top-level or from nested personal
  const read = (topKey, personalKey) => {
    // top-level value
    if (body[topKey] !== undefined && body[topKey] !== null && body[topKey] !== "") return body[topKey];
    // nested personal value e.g. body.personal.firstName
    if (srcPersonal && (srcPersonal[personalKey] !== undefined)) return srcPersonal[personalKey];
    // fallback empty
    return "";
  };

  // Basic validation - give helpful messages
  const bankId = body.bankId || (body.personal && body.personal.bankId) || null;
  if (!bankId) return res.status(400).json({ success: false, msg: "bankId is required" });
  if (!body.loanId && !body.loanName) return res.status(400).json({ success: false, msg: "loanId or loanName is required" });

  // Attach user if available (from protect middleware)
  const userId = req.user ? req.user._id : undefined;

  // Try to coerce loanId to ObjectId if possible
  let loanIdValue = body.loanId || null;
  if (loanIdValue) {
    try {
      if (mongoose.Types.ObjectId.isValid(loanIdValue)) {
        loanIdValue = mongoose.Types.ObjectId(loanIdValue);
      }
    } catch (e) { }
  }

  // Build personal fields with fallbacks:
  const firstName = read("firstName", "firstName") || "";
  const lastName = read("lastName", "lastName") || "";
  const combinedFullName = (body.fullName && String(body.fullName).trim()) ||
    (srcPersonal && (srcPersonal.fullName || `${srcPersonal.firstName || ''} ${srcPersonal.lastName || ''}`.trim())) ||
    `${firstName} ${lastName}`.trim();

  // Address helper: support old 'address' object or new 'currentAddress' naming
  const currAddrObj = (body.currentAddress && typeof body.currentAddress === "object") ? body.currentAddress :
    (body.currentAddress && typeof body.currentAddress === "string") ? { street: body.currentAddress } :
      (srcPersonal && (srcPersonal.currentAddress || srcPersonal.address)) ? (srcPersonal.currentAddress || srcPersonal.address) : {};

  const permAddrObj = (body.permanentAddress && typeof body.permanentAddress === "object") ? body.permanentAddress :
    (srcPersonal && srcPersonal.permanentAddress) ? srcPersonal.permanentAddress : {};

  // Employment fallback: accept body.monthlyIncome or body.employment.income
  const employmentSource = srcEmployment || {};
  const monthlyIncome = body.monthlyIncome || employmentSource.monthlyIncome || employmentSource.income || body.income || 0;

  // Documents: support both object-of-strings or object-of-objects
  const docsSrc = srcDocuments || body.documents || {};
  const normalizeDoc = d => {
    if (!d) return "";
    if (typeof d === "string") return d;
    if (typeof d === "object") return d.url || d.path || d.filename || "";
    return "";
  };

  const personal = body.personal || {};
  const employment = body.employment || {};

  // Ensure fullName exists (fallback from first & last name)
  personal.fullName = personal.fullName || combinedFullName;

  // ==========================
  // PERSONAL VALIDATION
  // ==========================
  if (!personal.fullName) return res.status(400).json({ success: false, msg: "Full name is required" });
  if (!personal.fatherName) return res.status(400).json({ success: false, msg: "Father's name is required" });
  if (!personal.age) return res.status(400).json({ success: false, msg: "Age is required" });
  if (!personal.dob) return res.status(400).json({ success: false, msg: "Date of birth is required" });
  if (!personal.gender) return res.status(400).json({ success: false, msg: "Gender is required" });
  if (!personal.email) return res.status(400).json({ success: false, msg: "Email is required" });
  if (!personal.phone) return res.status(400).json({ success: false, msg: "Phone number is required" });

  // CURRENT ADDRESS
  if (!personal.currentAddress?.street) return res.status(400).json({ success: false, msg: "Current address street is required" });
  if (!personal.currentAddress?.city) return res.status(400).json({ success: false, msg: "Current address city is required" });
  if (!personal.currentAddress?.state) return res.status(400).json({ success: false, msg: "Current address state is required" });
  if (!personal.currentAddress?.zip) return res.status(400).json({ success: false, msg: "Current address postal code is required" });

  // PERMANENT ADDRESS
  if (!personal.permanentAddress?.street) return res.status(400).json({ success: false, msg: "Permanent address street is required" });
  if (!personal.permanentAddress?.city) return res.status(400).json({ success: false, msg: "Permanent address city is required" });
  if (!personal.permanentAddress?.state) return res.status(400).json({ success: false, msg: "Permanent address state is required" });
  if (!personal.permanentAddress?.zip) return res.status(400).json({ success: false, msg: "Permanent address postal code is required" });

  // ==========================
  // EMPLOYMENT VALIDATION
  // ==========================
  if (!employment.employmentType) return res.status(400).json({ success: false, msg: "Employment type is required" });
  if (!employment.role) return res.status(400).json({ success: false, msg: "Role is required" });
  if (!employment.income) return res.status(400).json({ success: false, msg: "Monthly income is required" });

  // ==========================
  // DOCUMENT VALIDATION
  // ==========================
  if (!docsSrc.pan) return res.status(400).json({ success: false, msg: "PAN card is required" });
  // Aadhaar front must always exist
  if (!docsSrc.aadhaarFront)
    return res.status(400).json({ success: false, msg: "Aadhaar front is required" });

  // Check file extension to determine if back is required
  const aadhaarFrontExt = docsSrc.aadhaarFront.split('.').pop().toLowerCase();
  const isPdf = aadhaarFrontExt === "pdf";

  // If Aadhaar front is NOT a PDF, then Aadhaar back becomes required
  if (!isPdf && !docsSrc.aadhaarBack) {
    return res.status(400).json({
      success: false,
      msg: "Aadhaar back is required when front is not a PDF"
    });
  }

  if (!docsSrc.addressProof) return res.status(400).json({ success: false, msg: "Address proof is required" });
  if (!docsSrc.photo) return res.status(400).json({ success: false, msg: "Photo is required" });

  // ---- SALARY SLIPS ----

  // Salary Slip 1 MUST exist
  if (!docsSrc.salarySlip1) {
    return res.status(400).json({
      success: false,
      msg: "Salary Slip (Month 1) is required"
    });
  }

  // Determine file type of Slip 1
  const salarySlip1Ext = docsSrc.salarySlip1.split('.').pop().toLowerCase();
  const slip1IsPdf = salarySlip1Ext === "pdf";


  // ---- BANK STATEMENTS ----

  // Bank Statement 1 MUST exist
  if (!docsSrc.bankStatement1) {
    return res.status(400).json({
      success: false,
      msg: "Bank Statement (Month 1) is required"
    });
  }

  // Determine file type of Statement 1
  const bankStatement1Ext = docsSrc.bankStatement1.split('.').pop().toLowerCase();
  const bank1IsPdf = bankStatement1Ext === "pdf";


  // Build final payload
  const applicationPayload = {
    user: req.user?._id,
    bankId: body.bankId,
    bankName: body.bankName || "",
    loanId: mongoose.Types.ObjectId.isValid(body.loanId) ? body.loanId : null,
    loanName: body.loanName || "",
    loanAmount: Number(body.loanAmount) || 0,
    loanPurpose: body.loanPurpose || "Personal Use",

    personal: {
      fullName: personal.fullName || "",
      fatherName: personal.fatherName || "",
      age: personal.age || "",
      dob: personal.dob || "",
      gender: personal.gender || "",
      email: personal.email || "",
      phone: personal.phone || "",
      currentAddress: {
        street: personal.currentAddress?.street || "",
        city: personal.currentAddress?.city || "",
        state: personal.currentAddress?.state || "",
        zip: personal.currentAddress?.zip || ""
      },
      permanentAddress: {
        street: personal.permanentAddress?.street || "",
        city: personal.permanentAddress?.city || "",
        state: personal.permanentAddress?.state || "",
        zip: personal.permanentAddress?.zip || ""
      }
    },

    employment: {
      employmentType: employment.employmentType || "",
      companyName: employment.companyName || "",
      companyEmail: employment.companyEmail || "",
      role: employment.role || "",
      income: Number(employment.income) || 0,
      currentEmi: Number(employment.currentEmi) || 0,
      creditObligation: Number(employment.creditObligation) || 0,
    },
    reference: {
      ref1: {
        name: body.reference?.ref1?.name || "",
        relationship: body.reference?.ref1?.relationship || "",
        phone: body.reference?.ref1?.phone || "",
        address: body.reference?.ref1?.address || ""
      },
      ref2: {
        name: body.reference?.ref2?.name || "",
        relationship: body.reference?.ref2?.relationship || "",
        phone: body.reference?.ref2?.phone || "",
        address: body.reference?.ref2?.address || ""
      }
    },

    documents: {
      pan: normalizeDoc(docsSrc.pan),
      aadhaarFront: normalizeDoc(docsSrc.aadhaarFront),
      aadhaarBack: normalizeDoc(docsSrc.aadhaarBack),
      addressProof: normalizeDoc(docsSrc.addressProof),

      salarySlip1: normalizeDoc(docsSrc.salarySlip1),
      salarySlip2: normalizeDoc(docsSrc.salarySlip2),
      salarySlip3: normalizeDoc(docsSrc.salarySlip3),

      salarySlip1Password: docsSrc.salarySlip1Password || "",
      salarySlip2Password: docsSrc.salarySlip2Password || "",
      salarySlip3Password: docsSrc.salarySlip3Password || "",

      bankStatement1: normalizeDoc(docsSrc.bankStatement1),
      bankStatement2: normalizeDoc(docsSrc.bankStatement2),
      bankStatement3: normalizeDoc(docsSrc.bankStatement3),

      bankStatement1Password: docsSrc.bankStatement1Password || "",
      bankStatement2Password: docsSrc.bankStatement2Password || "",
      bankStatement3Password: docsSrc.bankStatement3Password || "",

      photo: normalizeDoc(docsSrc.photo)
    },

    status: body.status || "submitted",
    meta: body.meta || {}
  };

  try {
    const app = await Application.create(applicationPayload);
    return res.status(201).json({ success: true, data: app });
  } catch (err) {
    console.error("createApplication error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, msg: "Validation error", errors: err.errors });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, msg: `Invalid value for ${err.path}: ${err.value}` });
    }
    return res.status(500).json({ success: false, msg: err.message || "Server error" });
  }
});


export const getApplications = asyncHandler(async (req, res) => {
  if (req.user && req.user.role === "admin") {
    const apps = await Application.find({}).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: apps });
  } else if (req.user) {
    const apps = await Application.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: apps });
  } else {
    return res.status(401).json({ success: false, msg: "Unauthorized" });
  }
});

export const getApplication = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, msg: "Invalid id" });

  const app = await Application.findById(id).lean();
  if (!app) return res.status(404).json({ success: false, msg: "Application not found" });

  if (req.user && (req.user.role === "admin" || String(req.user._id) === String(app.user))) {
    return res.json({ success: true, data: app });
  }
  return res.status(403).json({ success: false, msg: "Forbidden" });
});

export const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ success: false, msg: "Application not found" });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({ success: true, msg: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const validStatuses = ["submitted", "pending", "in review", "approved", "rejected", "disbursed"];

  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ success: false, msg: "Invalid status" });
  }

  const app = await Application.findById(id);
  if (!app) return res.status(404).json({ success: false, msg: "Application not found" });

  app.status = status.toLowerCase();
  await app.save();

  return res.json({ success: true, msg: "Status updated successfully", data: app });
});




export default { createApplication, getApplications, getApplication, deleteApplication, updateApplicationStatus };
