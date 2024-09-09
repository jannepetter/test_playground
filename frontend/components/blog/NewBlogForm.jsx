import { createBlog } from "@/api/blogs";
import React, { useState } from "react";

const NewBlogForm = () => {
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
      <form onSubmit={handleSubmit} data-testid="new-blog-form">
        <div className="m-auto max-w-md">
          <label className="block text-gray-700">title:</label>
          <input
            className="border-2 m-5 w-full"
            type="text"
            value={title}
            data-testid="new-blog-form-title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <br></br>
          <label className="block text-gray-700">content:</label>
          <textarea
            className="border-2 m-5 w-full"
            type="text"
            rows="15"
            value={content}
            data-testid="new-blog-form-content"
            onChange={(e) => setContent(e.target.value)}
          />
          <br></br>
          <button type="submit" className="btn btn-primary my-10">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBlogForm;
