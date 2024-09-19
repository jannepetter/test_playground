"use client";
import React, { useState, useEffect } from "react";
import { getBlogDetail } from "@/api/blogs";
import UpdateBlog from "@/components/blog/UpdateBlog";

export default function Page({ params }) {
  const [blog, setBlog] = useState();
  const id = params.id;

  useEffect(() => {
    getBlogDetail(id).then((r) => setBlog(r.data));
  }, [id]);

  return (
    <>
      <UpdateBlog blog={blog} />
    </>
  );
}
