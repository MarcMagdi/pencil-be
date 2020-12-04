import express from "express";
import { Question } from "../../models/Question";

const router = express.Router();

router.get("/search", async (req, res) => {
  const q = req.query.q;

  if (!q) return res.send([]);

  const questions = await Question.find({ topics: q.toString() }).select(
    "questionNumber"
  );

  const questionNumbers = questions.map((q) => q.questionNumber);

  res.send(questionNumbers);
});

export default router;
