"use client";
import { getBlogDetail } from "@/api/blogs";
import BlogDetail from "@/components/blog/BlogDetail";
import React, { useState, useEffect } from "react";

export default function Page({ params }) {
  const [blog, setBlog] = useState();
  const id = params.id;
  useEffect(() => {
    getBlogDetail(id).then((r) => setBlog(r.data));
  }, [id]);

  return (
    <>
      <BlogDetail blog={blog} />
    </>
  );
}
