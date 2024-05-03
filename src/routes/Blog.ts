import express from "express";
import { auth } from "../controllers/middlewares";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  getUserBlogs,
  updateBlog,
} from "../controllers/Blogs";

const router = express.Router();

router.post("/blog", auth, createBlog);

router.put("/update-blog", auth, updateBlog);

router.get("/blog/:id", auth, getBlog);

router.get("/getAllBlogs", getAllBlogs);

router.delete("/delete-blog/:id", auth, deleteBlog);

router.get("/userBlogs", auth, getUserBlogs);

export default router;
