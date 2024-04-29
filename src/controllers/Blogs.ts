import type { Request, Response } from "express";
import z from "zod";
import Post from "../models/Post";

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const { id } = req.user;

    const schema = z.object({
      title: z.string().trim(),
      content: z.string(),
    });

    if (!title || !content) {
      return res.status(403).json({
        success: false,
        msg: "All fields are required",
      });
    }

    try {
      schema.parse(req.body);
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: "Validation Error",
        error,
      });
    }

    const blog = await Post.create({
      title,
      content,
      published: true,
      author: id,
    });

    return res.status(200).json({
      success: true,
      msg: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Something went wrong creating blog.",
      error,
    });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { postId, title, content } = req.body;

    const blog = await Post.findById(postId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        msg: "Blog not found",
      });
    }

    let updatedTitle = blog.title;
    let updatedContent = blog.content;

    if (title) {
      updatedTitle = title;
    }

    if (content) {
      updatedContent = content;
    }

    const updatedBlog = await Post.findByIdAndUpdate(
      postId,
      {
        title: updatedTitle,
        content: updatedContent,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Blog updated Successfully",
      data: updatedBlog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error while updating the Blog",
      error,
    });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(404).json({
        success: false,
        msg: "Please provide the id of the blog to be deleted",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        success: false,
        msg: "Not able to find the Post",
      });
    }

    const deletedBlog = await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      msg: "Blog deleted Successfully",
      data: deletedBlog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error while deleting Blog Post",
      error,
    });
  }
};

export const getBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const blog = await Post.findById(id).populate("author");

    return res.status(200).json({
      success: true,
      msg: "Successfully got the Blog Post.",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error while getting Blog",
      error,
    });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Post.find().populate("author");

    return res.status(200).json({
      success: true,
      msg: "Blogs fetched Successfully",
      data: blogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error getting Blogs",
      error,
    });
  }
};
