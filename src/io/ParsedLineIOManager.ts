import readline from "readline";
import { Readable } from "stream";
import { CommandParsingError, Logger, Parser } from "../types";

// ParsedLineIO manages input streams processing line-by-line.
// It allows the caller to iterate over the parsed lines.
export class ParsedLineIOManager<C> implements AsyncIterable<C> {
  private rl: readline.Interface;
  private lineIterator: AsyncIterableIterator<string>;

  constructor(
    readStream: Readable,
    private readonly parser: Parser<C>,
    private readonly logger?: Logger
  ) {
    this.rl = readline.createInterface({
      input: readStream,
    });

    this.lineIterator = this.rl[Symbol.asyncIterator]();
  }

  private createCommand(line: string) {
    try {
      return this.parser.parseLine(line);
    } catch (err) {
      if (!(err instanceof CommandParsingError)) throw err;
      this.logger?.log("Invalid command!");
    }
  }

  public async next(): Promise<IteratorResult<C>> {
    let processedValue: C | undefined;

    while (true) {
      const { value, done } = await this.lineIterator.next();

      if (done) {
        this.rl.close();
        return { done: true, value: undefined };
      }

      processedValue = this.createCommand(value);
      if (processedValue) break;
    }

    return { done: false, value: processedValue };
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<C> {
    return this;
  }
}
