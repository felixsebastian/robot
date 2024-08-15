import { ParsedLineIOManager } from "./ParsedLineIOManager";
import { Readable } from "stream";

class SimpleError extends Error {}

class SimpleParser {
  parseLine(line: string) {
    if (line === "ONE") return 1;
    if (line === "TWO") return 2;
    throw new SimpleError();
  }
}

describe("ParsedLineIO", () => {
  const createMockStream = (data: string[]): Readable => {
    const mockStream = new Readable({
      read() {
        data.forEach((line) => this.push(`${line}\n`));
        this.push(null); // End of stream
      },
    });

    return mockStream;
  };

  it("should iterate over the commands correctly", async () => {
    const mockStream = createMockStream(["ONE", "TWO"]);
    const io = new ParsedLineIOManager(mockStream, new SimpleParser());
    const commands: number[] = [];

    for await (const command of io) {
      commands.push(command);
    }

    expect(commands).toHaveLength(2);
    expect(commands[0]).toBe(1);
    expect(commands[1]).toBe(2);
  });

  it("should handle an empty stream", async () => {
    const mockStream = createMockStream([]);
    const io = new ParsedLineIOManager(mockStream, new SimpleParser());
    const commands: number[] = [];

    for await (const command of io) {
      commands.push(command);
    }

    expect(commands).toHaveLength(0);
  });

  it("should throw an error for invalid commands", async () => {
    const mockStream = createMockStream(["FIVE"]);
    const io = new ParsedLineIOManager(mockStream, new SimpleParser());

    await expect(async () => {
      for await (const command of io) {
        command;
      }
    }).rejects.toThrow(SimpleError);
  });
});
