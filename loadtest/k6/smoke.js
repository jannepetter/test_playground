import { testSetup } from "./common/functions.js";
import { dataConsumerActions, dataCreatorActions } from "./common/actions.js";

// docker-compose run --rm k6 run /scripts/smoke.js

export const options = {
  summaryTrendStats: ["p(95)", "p(99)"],
  thresholds: {
    "http_req_duration{name:blog}": ["p(95)<500"],
    "http_req_duration{name:login}": ["p(95)<600"],
    http_req_failed: ["rate < 0.01"], // less than 1%
  },
  scenarios: {
    basicUser: {
      executor: "shared-iterations",
      exec: "sc1",
      vus: 20,
      iterations: 40,
      maxDuration: "1m",
    },
    contentCreator: {
      executor: "shared-iterations",
      exec: "sc2",
      vus: 10,
      iterations: 20,
      maxDuration: "1m",
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
