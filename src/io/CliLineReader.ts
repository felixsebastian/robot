import * as readline from "readline";
import { Readable } from "stream";
import { Logger } from "../types";

export class CliLineReader extends Readable {
  private rl: readline.Interface;

  constructor(private readonly logger: Logger) {
    super({ objectMode: true });

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    this.start();
  }

  start() {
    this.logger.log("Enter commands line by line, enter 'finish' to process.");

    this.rl.on("line", (line) => {
      if (line === "exit") {
        this.rl.close();
        return;
      }

      this.push(`${line}\n`);
    });

    this.rl.on("close", () => this.push(null));
  }

  _read() {
    // No-op: We're pushing data as it arrives from the readline interface
  }
}
