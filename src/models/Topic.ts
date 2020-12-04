import { Document, Schema, model } from "mongoose";
import { ModelNames } from "../utils/constants";

export interface ITopicSchema extends Document {
  topic: string;
  parents: string[];
}

export const TopicSchema = new Schema(
  {
    topic: { type: String, unique: true, index: true, required: true },
    parents: [{ type: String }],
  },
  { timestamps: true }
);

export const Topic = model<ITopicSchema>(ModelNames.Topic, TopicSchema);
