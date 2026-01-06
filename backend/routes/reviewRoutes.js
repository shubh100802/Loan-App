import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, rating, message } = req.body;
    const review = await Review.create({ name, rating, message });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.get("/", async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

router.delete("/:id", async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
