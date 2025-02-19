import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from "../Pagination";
import { getUsers } from "@/api/users";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  useEffect(() => {
    getUsers()
      .then((r) => {
        setUsers(r.data);
      })
      .catch((e) => {
        console.log("err", e);
        if (
          e.response.status === 401 &&
          e.response.data.detail === "Given token not valid for any token type"
        ) {
          // refresh token expired
          router.push("/login");
        } else if (e.response.status === 403) {
          setUsers([]);
        }
      });
  }, [router]);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="my-10">Users</h1>
      <ul className="h-[500px] mx-auto" data-testid="userList">
        {users?.results?.map((u) => (
          <li key={u.id} className="border-1 mx-auto my-5 text-lg bg-gray-50">
            <span>{u.username}</span>
            <span className="ml-20">{u.email}</span>
          </li>
        ))}
      </ul>
      <Pagination data={users}></Pagination>
    </div>
  );
};

export default UserList;
