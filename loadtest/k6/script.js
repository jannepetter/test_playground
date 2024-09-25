import { sleep, check } from "k6";
import http from "k6/http";
import { login } from "./common/functions.js";
import { SharedArray } from "k6/data";

const users = new SharedArray("users", function () {
  return JSON.parse(open("./common/data.json"));
});

const SERVER_URL = __ENV.TEST_URL || "http://server:8000";

export const options = {
  summaryTrendStats: ["p(95)", "p(99)"],
  thresholds: {
    // http_req_duration: ["p(95) < 600"],
    // "http_req_duration{type:login}": ["p(95) < 600"],
    "http_req_duration{type:blog}": ["p(95) < 500"],
    http_req_failed: ["rate < 0.01"], // Error rate should be less than 1%
  },
  scenarios: {
    basicUser: {
      executor: "shared-iterations",
      exec: "quickTest",
      vus: 5,
      iterations: 10,
      maxDuration: "1m",
    },
    bloggerUser: {
      executor: "shared-iterations",
      exec: "quickTest",
      vus: 5,
      iterations: 20,
      maxDuration: "1m",
    },
  },
};
export function setup() {
  const userData = [];
  for (const user of users) {
    const headers = login(SERVER_URL, user.username, user.password);
    userData.push({ ...user, headers });
  }
  return userData;
}

export function quickTest(data) {
  const user = data[__VU % data.length];
  const res = http.get(`${SERVER_URL}/api/blog`, user.headers, {
    tags: { type: "blog" },
  });
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
  sleep(1);
}
