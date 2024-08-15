import { Logger } from "../types";

export class MemoryLogger implements Logger {
  public state = "";

  log(text: string) {
    this.state += `${text}\n`;
  }
}
