import { createBlog } from "@/api/blogs";
import React, { useState } from "react";
import BlogForm from "./BlogForm";

const NewBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBlog({
      title,
      content,
    });
    setTitle("");
    setContent("");
  };

  return (
    <div>
      <BlogForm
        onSubmit={handleSubmit}
        onContentChange={setContent}
        onTitleChange={setTitle}
        title={title}
        content={content}
        testId="new-blog-form"
      />
    </div>
  );
};

export default NewBlog;
