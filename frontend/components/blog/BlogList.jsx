import React from "react";
import Link from "next/link";

const BlogList = ({ blogList }) => {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="my-10">Blogs</h1>
      <ul className="mx-auto" data-testid="blogList">
        {blogList.map((b) => (
          <Link key={b.id} href={`/blogs/${b.id}`}>
            <li className="border-1 mx-auto my-5 text-lg bg-gray-50 max-w-xs">{b.title}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
