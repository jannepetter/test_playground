import http from "k6/http";
import { sleep, check } from "k6";

export function login(baseUrl, username, password) {
  const res = http.post(
    `${baseUrl}/api/token/`,
    {
      username,
      password,
    },
    { tags: { type: "login" } }
  );
  let checkRes = check(res, {
    "status is 200": (r) => r.status === 200,
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
