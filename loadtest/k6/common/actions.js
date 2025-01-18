import {
  createBlog,
  getBlogDetail,
  getBlogList,
  sleepRandom,
} from "./functions.js";

export function dataConsumerActions(data) {
  const user = data[__VU % data.length];
  const headers = user.headers;
  const blogs = getBlogList(headers).results;
  sleepRandom();
  let random = Math.floor(Math.random() * blogs.length);
  getBlogDetail(blogs[random].id, headers);
  sleepRandom();

  random = Math.floor(Math.random() * blogs.length);
  getBlogDetail(blogs[random].id, headers);
  sleepRandom();
}

export function dataCreatorActions(data) {
  const user = data[__VU % data.length];
  const headers = user.headers;

  const newBlog = {
    title: "automatically created",
    content: "automatically created content",
  };
  createBlog(newBlog, headers);
  sleepRandom();
}
