import { testSetup } from "./common/functions.js";
import { dataConsumerActions, dataCreatorActions } from "./common/actions.js";

const SCENARIO1_TARGET = 20
const SCENARIO2_TARGET = 10

export const options = {
  summaryTrendStats: ["p(95)", "p(99)"],
  thresholds: {
    "http_req_duration{name:blog}": ["p(95)<1500"],
    "http_req_duration{name:login}": ["p(95)<2000"],
    http_req_failed: ["rate < 0.01"], // less than 1%
  },
  scenarios: {
    scenario_1: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: SCENARIO1_TARGET },
        { duration: "2m", target: SCENARIO1_TARGET },
        { duration: "2m", target: 0 },
      ],
      exec: "sc1",
    },
    scenario_2: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: SCENARIO2_TARGET },
        { duration: "11h56m", target: SCENARIO2_TARGET },
        { duration: "2m", target: 0 },
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
