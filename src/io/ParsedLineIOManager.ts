import readline from "readline";
import { Readable } from "stream";
import { Parser } from "../types";

// ParsedLineIO manages input streams processing line-by-line.
// It allows the caller to iterate over the parsed lines.
export class ParsedLineIOManager<C> implements AsyncIterable<C> {
  private rl: readline.Interface;
  private lineIterator: AsyncIterableIterator<string>;

  constructor(readStream: Readable, private readonly parser: Parser<C>) {
    this.rl = readline.createInterface({
      input: readStream,
    });

    this.lineIterator = this.rl[Symbol.asyncIterator]();
  }

  private createCommand(line: string) {
    return this.parser.parseLine(line);
  }

  public async next(): Promise<IteratorResult<C>> {
    const { value, done } = await this.lineIterator.next();

    if (done) {
      this.rl.close();
      return { done: true, value: undefined };
    }

    const processedValue = this.createCommand(value);
    return { done: false, value: processedValue };
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<C> {
    return this;
  }
}
