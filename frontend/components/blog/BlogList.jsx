import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBlogs } from "@/api/blogs";
import Pagination from "../Pagination";


const BlogList = () => {
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


  const onUpdatePage = async(page)=>{

    if(page){
      const newBlogs = await getBlogs(page)
      setBlogs(newBlogs.data)
    }
  }
  return (
    <div className="mx-auto max-w-md">
      <h1 className="my-10">Blogs</h1>
      <ul className="h-[500px] mx-auto" data-testid="blogList">
        {blogs?.results?.map((b) => (
          <Link key={b.id} href={`/blogs/${b.id}`}>
            <li className="border-1 mx-auto my-5 text-lg bg-gray-50 max-w-xs">{b.title}</li>
          </Link>
        ))}
      </ul>
      <Pagination data={blogs} onUpdatePage={onUpdatePage}></Pagination>
    </div>
  );
};

export default BlogList;
