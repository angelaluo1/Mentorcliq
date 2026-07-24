import express from "express";
import { getNavigationGuidance } from "../services/claudeService.js";
import { findRelevantResources } from "../services/retrievalService.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";

    if (!question) {
      return res.status(400).json({
        error: "Question is required.",
      });
    }

    if (question.length > 1000) {
      return res.status(400).json({
        error: "Question is too long. Please keep it under 1000 characters.",
      });
    }

    const relevantResources = findRelevantResources(question);
    const guidance = await getNavigationGuidance(question, relevantResources);

    res.json(guidance);
  } catch (error) {
    next(error);
  }
});

export default router;
