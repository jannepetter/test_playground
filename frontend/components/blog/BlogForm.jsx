import React from "react";

const BlogForm = ({
  onSubmit,
  onTitleChange,
  onContentChange,
  title,
  content,
  testId,
  buttonName = "Submit",
}) => {
  return (
    <div>
      <form onSubmit={onSubmit} data-testid={testId}>
        <div className="m-auto max-w-md">
          <label className="block text-gray-700">
            title:
            <input
              className="border-2 m-5 w-full"
              type="text"
              value={title}
              data-testid={`${testId}-title`}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </label>
          <br></br>
          <label className="block text-gray-700">
            content:
            <textarea
              className="border-2 m-5 w-full"
              type="text"
              rows="15"
              value={content}
              data-testid={`${testId}-content`}
              onChange={(e) => onContentChange(e.target.value)}
            />
          </label>
          <br></br>
          <button type="submit" className="btn btn-primary my-10">
            {buttonName}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
