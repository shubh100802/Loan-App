// backend/controllers/applicationController.js
import asyncHandler from "express-async-handler";
import Application from "../models/Application.js";
import mongoose from "mongoose";

/**
 * Create new application
 * POST /api/applications
 * Protected
 */
/**
 * Get all applications (admin only)
 * GET /api/applications/admin/all
 * Admin protected
 */
export const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({})
    .sort({ createdAt: -1 })
    .populate('user', 'name email mobile')
    .populate('loanId', 'loanName bankName');
  
  res.json({ success: true, data: applications });
});

/**
 * Create new application
 * POST /api/applications
 * Protected
 */
export const createApplication = asyncHandler(async (req, res) => {
  const body = req.body || {};

  // Basic validation - give helpful messages
  if (!body.bankId) return res.status(400).json({ success: false, msg: "bankId is required" });
  if (!body.loanId && !body.loanName) return res.status(400).json({ success: false, msg: "loanId or loanName is required" });

  // Attach user if available (from protect middleware)
  const userId = req.user ? req.user._id : undefined;

  // Try to coerce loanId to ObjectId if possible, otherwise leave as string (avoid hard crash)
  let loanIdValue = body.loanId || null;
  if (loanIdValue) {
    try {
      if (mongoose.Types.ObjectId.isValid(loanIdValue)) {
        loanIdValue = mongoose.Types.ObjectId(loanIdValue);
      }
    } catch (e) {
      // keep loanIdValue as-is (string) but do not crash
    }
  }

  // Build application object carefully
  const applicationPayload = {
    user: userId,
    bankId: body.bankId,
    bankName: body.bankName || "",
    loanId: loanIdValue,
    loanName: body.loanName || (typeof body.loanName === "string" ? body.loanName : ""),
    loanAmount: parseFloat(body.loanAmount) || 0,
    loanPurpose: body.loanPurpose || "Personal Use",
    // Map flat structure to nested personal object
    personal: {
      firstName: body.fullName?.split(' ')[0] || '',
      lastName: body.fullName?.split(' ').slice(1).join(' ') || '',
      email: body.email || '',
      phone: body.phone || '',
      dob: body.dob || '',
      gender: body.gender || '',
      address: {
        street: body.address || '',
        city: body.city || '',
        state: body.state || '',
        zip: body.postalCode || ''
      }
    },
    // Map flat structure to employment object
    employment: {
      employmentType: body.employmentType || '',
      income: parseFloat(body.monthlyIncome) || 0
    },
    // Convert documents object to array if needed
    documents: body.documents ? Object.entries(body.documents).map(([name, url]) => ({
      name: name,
      url: url
    })) : [],
    status: body.status || "submitted",
    meta: body.meta || {}
  };

  try {
    const app = await Application.create(applicationPayload);
    return res.status(201).json({ success: true, data: app });
  } catch (err) {
    console.error("createApplication error:", err);

    // Mongoose validation / cast errors often have useful info
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, msg: "Validation error", errors: err.errors });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, msg: `Invalid value for ${err.path}: ${err.value}` });
    }

    // Generic fallback with message
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

export default { createApplication, getApplications, getApplication };
