import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
const Pagination = ({ data }) => {
  const getPage = (url) => {
    if (!url) {
      return null;
    }
    const parsedUrl = new URL(url);
    const pageNumber = parsedUrl.searchParams.get("page");
    return parseInt(pageNumber);
  };

  const handleData = (data) => {
    if (!data?.count) {
      return { current: 1, pageList: [1] };
    }
    const PAGINATION = 10;
    const maxPages = Math.ceil(data.count / PAGINATION);
    const prevPage = getPage(data.previous);
    const nextPage = getPage(data.next);
    let current;
    let pageList = [1, maxPages];

    if (prevPage) {
      current = prevPage + 1;
    } else if (nextPage) {
      current = nextPage - 1;
    } else {
      current = 1;
    }

    for (let i = 1; i <= 2; i++) {
      pageList.push(current - i, current + i);
    }

    pageList.push(current);

    pageList = Array.from(new Set(pageList.sort())).filter((v) => v > 0 && v <= maxPages);

    return { current: current, pageList: pageList };
  };

  const paginationData = handleData(data);
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  return (
    <div className="join">
      {paginationData.pageList.map((p) => (
        <button
          key={p}
          className={`join-item btn btn${paginationData.current === p && p !== 1 ? "-disabled" : ""}`}
          onClick={() => {
            newSearchParams.set("page", p);
            router.push(`?${newSearchParams.toString()}`);
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
