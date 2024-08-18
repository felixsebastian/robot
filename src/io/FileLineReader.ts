import * as readline from "readline";
import { Readable } from "stream";
import * as fs from "fs";

export class FileLineReader extends Readable {
  private fileStream: fs.ReadStream;
  private lineReader: readline.Interface;

  constructor(filePath: string) {
    super({ objectMode: true }); // Use objectMode to emit lines as strings
    this.fileStream = fs.createReadStream(filePath);

    this.lineReader = readline.createInterface({
      input: this.fileStream,
      crlfDelay: Infinity,
    });

    this.lineReader.on("line", (line: string) => {
      if (!this.push(`${line}\n`)) this.lineReader.pause();
    });

    this.lineReader.on("error", (err) => {
      if (err.code === "ENOENT") {
        console.error("File not found!");
      } else {
        console.error(err.message);
      }
    });

    this.lineReader.on("close", () => this.push(null));
  }

  _read() {
    this.lineReader.resume();
  }

  _destroy(err: Error | null, callback: (error?: Error | null) => void) {
    this.fileStream.destroy();
    this.lineReader.close();
    callback(err);
  }
}
