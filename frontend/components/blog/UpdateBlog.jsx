"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateBlog } from "@/api/blogs";
import BlogForm from "./BlogForm";

const UpdateBlog = ({ blog }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
    }
  }, [blog]);

  if (!blog) {
    return null;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBlog = {
      id: blog.id,
      title,
      content,
    };
    await updateBlog(updatedBlog);
    setTitle("");
    setContent("");
    router.push("/blogs");
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="my-10">Update Blog</h1>
      <BlogForm
        onSubmit={handleSubmit}
        onContentChange={setContent}
        onTitleChange={setTitle}
        title={title}
        content={content}
        testId="update-blog-form"
      />
    </div>
  );
};

export default UpdateBlog;
