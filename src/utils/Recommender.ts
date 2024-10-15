import { random } from "lodash-es";

export class Recommender {
  staged() {}
  ok() {
    return random(1, 100) > random(1, 100);
  }
}
