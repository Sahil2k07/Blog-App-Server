import mongoose, { Document } from "mongoose";

interface Post extends Document {
  title: string;
  content: string;
  published: boolean;
  author: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const postSchema = new mongoose.Schema<Post>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<Post>("Post", postSchema);
