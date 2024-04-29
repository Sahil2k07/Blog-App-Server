import mongoose, { Document } from "mongoose";

interface User extends Document {
  email: string;
  name?: string;
  password: string;
  posts: mongoose.Schema.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

export default mongoose.model<User>("User", userSchema);
