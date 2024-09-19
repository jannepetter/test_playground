"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogList from "@/components/blog/BlogList";
import { getBlogs } from "@/api/blogs";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getBlogs()
      .then((r) => {
        setBlogs(r.data);
      })
      .catch((e) => {
        console.log("err", e);
        if (
          e.response.status === 401 &&
          e.response.data.detail === "Given token not valid for any token type"
        ) {
          // refresh token expired
          router.push("/login");
        }
      });
  }, [router]);

  return (
    <>
      <BlogList blogList={blogs} />
    </>
  );
};

export default Blogs;
