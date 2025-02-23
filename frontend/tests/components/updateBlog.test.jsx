import "@testing-library/jest-dom";
import { fireEvent, render, screen,within, waitFor } from "@testing-library/react";
import React from "react";
import UpdateBlog from "@/components/blog/UpdateBlog";
import { updateBlog } from "@/api/blogs";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../../api/blogs", () => ({
  updateBlog: jest.fn(),
}));

jest.mock("../../utils/storage", () => ({
  saveUserToLocalStorage: jest.fn(),
}));

const blog = {
    title: "title",
    content:"some content"
}

describe("Update blog", () => {
  it("works", async () => {
    render(
        <UpdateBlog blog={blog} />
    );
    const updateBlogForm = screen.getByTestId("update-blog-form");
    expect(updateBlogForm).toBeInTheDocument();
    const titleInput = within(updateBlogForm).getByLabelText("title:")
    fireEvent.change(titleInput,{target:{value:"updated title"}})
    const contentInput = within(updateBlogForm).getByLabelText("content:")
    fireEvent.change(contentInput, { target: { value: "Updated Content" } })

    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);
    await waitFor(() => {
        expect(updateBlog).toHaveBeenCalledTimes(1);
        expect(updateBlog).toHaveBeenCalledWith({
          title: "updated title",
          content: "Updated Content",
        });
      });
  });
});
