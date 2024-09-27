import { testSetup } from "./common/functions.js";
import { dataConsumerActions, dataCreatorActions } from "./common/actions.js";

export const options = {
  summaryTrendStats: ["p(95)", "p(99)"],
  thresholds: {
    "http_req_duration{name:blog}": ["p(95)<500"],
    "http_req_duration{name:login}": ["p(95)<600"],
    http_req_failed: ["rate < 0.01"], // less than 1%
  },
  scenarios: {
    scenario_1: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 20 },
        { duration: "4m", target: 20 },
        { duration: "1m", target: 0 },
      ],
      exec: "sc1",
    },
    scenario_2: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 10 },
        { duration: "4m", target: 10 },
        { duration: "1m", target: 0 },
      ],
      exec: "sc2",
    },
  },
};
export function setup() {
  return testSetup();
}

export function sc1(data) {
  dataConsumerActions(data);
}

export function sc2(data) {
  dataCreatorActions(data);
}
