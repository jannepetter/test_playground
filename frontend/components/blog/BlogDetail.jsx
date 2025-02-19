"use client";

import { deleteBlog } from "@/api/blogs";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user";
import ConfirmModal from "../ConfirmModal";
import Link from "next/link";

export default function BlogDetail({ blog }) {
  const [user, _] = useUserContext(); // eslint-disable-line no-unused-vars
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!blog) {
    return null;
  }

  const handleDelete = async () => {
    await deleteBlog(blog.id);
    router.push("/blogs");
  };

  return (
    <div className="m-20 p-5 bg-base-300">
      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={(e) => handleDelete(e)}
        title="Delete blog?"
        content="Confirm blog delete"
      ></ConfirmModal>
      <div className="m-10" data-testid="blog-detail">
        <h1 className="my-5">{blog.title}</h1>
        <address className="mb-10 font-light">
          Written by:
          <a
            href={`/blogs?username=${blog.user.username}`}
            className="underline hover:text-blue-800"
          >
            {blog.user.username}
          </a>
        </address>
        <p>{blog.content}</p>
        {user.id == blog.user.id && (
          <>
            <button className="btn btn-secondary mt-20" onClick={() => setIsOpen(true)}>
              Delete
            </button>
            <Link className="btn btn-outline mt-20 ml-5" href={`/blogs/${blog.id}/update`}>
              Update
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
