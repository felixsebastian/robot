import { Logger } from "../types";

export class ConsoleLogger implements Logger {
  log(text: string) {
    console.log(text);
  }
}
