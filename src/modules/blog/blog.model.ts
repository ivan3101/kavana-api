import { Document, model, Model, Schema, Types } from "mongoose";

export interface IBlog extends Document {
  _id: Types.ObjectId;
  header: string;
  createdAt: Date;
  body: string;
  images: Array<{
    key: string;
    path: string;
  }>;
  resume: string;
  featured: boolean;
}

const blogSchema = new Schema({
  header: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  body: String,
  images: [
    {
      key: String,
      path: String
    }
  ],
  resume: String,
  featured: Boolean
});

export const blogModel: Model<IBlog> = model<IBlog>("post", blogSchema);
