import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

const SERVER_URL = __ENV.TEST_URL || "http://server:8000";

const users = new SharedArray("users", function () {
  return JSON.parse(open("./data.json"));
});

export function login(username, password) {
  const res = http.post(
    `${SERVER_URL}/api/token/`,
    {
      username,
      password,
    },
    { tags: { name: "login" } }
  );
  check(res, {
    "login status is 200": (r) => r.status === 200,
  });
  const response = JSON.parse(res.body);

  const reqHeader = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${response.access}`,
    },
  };
  return reqHeader;
}

export function getBlogList(headers) {
  const res = http.get(`${SERVER_URL}/api/blog/`, {
    ...headers,
    tags: { name: "blog" },
  });
  check(res, {
    "getBlogList status is 200": (r) => r.status === 200,
  });
  return JSON.parse(res.body);
}

export function getBlogDetail(id, headers) {
  const res = http.get(`${SERVER_URL}/api/blog/${id}/`, {
    ...headers,
    tags: { name: "blog" },
  });
  check(res, {
    "getBlogDetail status is 200": (r) => r.status === 200,
  });
  return JSON.parse(res.body);
}

export function createBlog(data, headers) {
  const res = http.post(`${SERVER_URL}/api/blog/`, JSON.stringify(data), {
    ...headers,
    tags: { name: "blog" },
  });
  check(res, {
    "create blog status is 201": (r) => r.status === 201,
  });
  return JSON.parse(res.body);
}

export function testSetup() {
  const userData = [];
  for (const user of users) {
    const headers = login(user.username, user.password);
    userData.push({ ...user, headers });
  }
  return userData;
}

export function sleepRandom(base = 1, upper = 3) {
  sleep(base + Math.floor(Math.random() * upper));
}
