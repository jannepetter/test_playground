import "@testing-library/jest-dom";
import { fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import BlogList from "@/components/blog/BlogList";
import React from "react";
import BlogDetail from "@/components/blog/BlogDetail";
import { UserProvider } from "@/context/user";
import { deleteBlog, createBlog, getBlogs } from "@/api/blogs";
import NewBlog from "@/components/blog/NewBlog";

jest.mock("../../api/blogs", () => ({
  deleteBlog: jest.fn(),
  createBlog: jest.fn(),
  getBlogs: jest.fn(),
}));

const blogs = [
  {
    id: 1,
    title: "blog title",
    content: "test content",
    user: {
      username: "testuser",
      id: 1,
    },
  },
  {
    id: 2,
    title: "test blog",
    content: "some content",
    user: {
      username: "anotheruser",
      id: 2,
    },
  },
];


jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));


describe("Blog components", () => {
  it("BlogList renders a list of links", async () => {
    getBlogs.mockResolvedValue({data:{
      count:2,
      next:null,
      previous:null,
      results:blogs
    }})
    render(<BlogList/>);
    await waitFor(() => {
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute("href", "/blogs/1");
      expect(links[1]).toHaveAttribute("href", "/blogs/2");
      expect(screen.getByText("blog title")).toBeInTheDocument();
      expect(screen.getByText("test blog")).toBeInTheDocument();
    });
  });

  it("Blogdetails gets rendered correctly for the blog creator", () => {
    window.localStorage.setItem("username", "testuser");
    window.localStorage.setItem("userId", 1);

    render(
      <UserProvider>
        <BlogDetail blog={blogs[0]} />
      </UserProvider>,
    );

    const deleteButton = screen.queryByRole("button", { name: "Delete" });
    expect(deleteButton).toBeInTheDocument();
    expect(screen.getByText("blog title")).toBeInTheDocument();
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  it("Blogdetails gets rendered correctly for another blog reader", () => {
    window.localStorage.setItem("username", "someuser");
    window.localStorage.setItem("userId", 55);

    render(
      <UserProvider>
        <BlogDetail blog={blogs[0]} />
      </UserProvider>,
    );

    const deleteButton = screen.queryByRole("button", { name: "Delete" });
    expect(deleteButton).toBeNull();
    expect(screen.getByText("blog title")).toBeInTheDocument();
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  it("Blogdetail can be deleted by the creator", () => {
    window.localStorage.setItem("username", "testuser");
    window.localStorage.setItem("userId", 1);

    render(
      <UserProvider>
        <BlogDetail blog={blogs[0]} />
      </UserProvider>,
    );

    const deleteButton = screen.queryByRole("button", { name: "Delete" });
    expect(deleteButton).toBeVisible();

    const dialogNotVisible = screen.queryByRole("dialog");
    expect(dialogNotVisible).toBeNull();

    fireEvent.click(deleteButton);
    const dialog = screen.queryByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Delete blog?");
    expect(dialog).toHaveTextContent("Confirm blog delete");

    const dialogWithin = within(dialog);
    const dialogConfirmBtn = dialogWithin.getByRole("button", { name: "Confirm" });
    expect(dialogConfirmBtn).toBeInTheDocument();
    expect(dialogWithin.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

    fireEvent.click(dialogConfirmBtn);
    // check that the mocked deleteBlog function got called with blog.id === 1
    expect(deleteBlog).toHaveBeenCalledWith(1);
  });

  it("NewBlog renders correctly", async () => {
    render(<NewBlog />);

    const blogForm = screen.getByTestId("new-blog-form");
    expect(blogForm).toBeInTheDocument();

    expect(screen.getByText("title:")).toBeInTheDocument();
    expect(screen.getByText("content:")).toBeInTheDocument();

    const titleInput = screen.getByTestId("new-blog-form-title");
    fireEvent.change(titleInput, { target: { value: "Jest Test Title" } });

    const contentInput = screen.getByTestId("new-blog-form-content");
    fireEvent.change(contentInput, { target: { value: "Jest Test Content" } });

    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createBlog).toHaveBeenCalledTimes(1);
      expect(createBlog).toHaveBeenCalledWith({
        title: "Jest Test Title",
        content: "Jest Test Content",
      });
    });
  });
});
