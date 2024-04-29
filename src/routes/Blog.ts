import express from "express";
import { auth } from "../controllers/middlewares";
import { createBlog, deleteBlog, getAllBlogs, getBlog, updateBlog } from "../controllers/Blogs";

const router = express.Router();

router.post("/blog", auth, createBlog);

router.put("/update-blog", auth, updateBlog);

router.get("/blog/get-blog", auth, getBlog);

router.get("/blog/getAllBlogs", auth, getAllBlogs);

router.delete("/blog/delete-blog", auth, deleteBlog);

export default router;
