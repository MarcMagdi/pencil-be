import { Document, Schema, model } from "mongoose";
import { ModelNames } from "../utils/constants";

export interface IQuestionSchema extends Document {
  questionNumber: string;
  topics: string[];
}

export const QuestionSchema = new Schema(
  {
    questionNumber: { type: String, unique: true, index: true, required: true },
    topics: [{ type: String, index: true }],
  },
  { timestamps: true }
);

export const Question = model<IQuestionSchema>(
  ModelNames.Question,
  QuestionSchema
);
