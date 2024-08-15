import {
  Move,
  Place,
  GridMovementCommand,
  Report,
} from "./GridMovementCommand";
import { GridMovementCommandParser } from "./GridMovementCommandParser";
import { GridMovementFileBasedIO } from "./GridMovementFileBasedIO";
import { Readable } from "stream";

describe("GridMovementFileBasedIO", () => {
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
    const mockData = ["PLACE 0,0,NORTH", "MOVE", "REPORT"];
    const mockStream = createMockStream(mockData);

    const io = new GridMovementFileBasedIO(
      mockStream,
      new GridMovementCommandParser()
    );

    const commands: GridMovementCommand[] = [];

    for await (const command of io) {
      commands.push(command);
    }

    expect(commands).toHaveLength(3);
    expect(commands[0]).toBeInstanceOf(Place);
    expect((commands[0] as Place).position.x).toBe(0);
    expect((commands[0] as Place).position.y).toBe(0);
    expect((commands[0] as Place).facing).toBe("NORTH");
    expect(commands[1]).toBeInstanceOf(Move);
    expect(commands[2]).toBeInstanceOf(Report);
  });

  it.skip("should handle an empty stream", async () => {
    const mockStream = createMockStream([]);

    const io = new GridMovementFileBasedIO(
      mockStream,
      new GridMovementCommandParser()
    );

    const commands: GridMovementCommand[] = [];

    for await (const command of io) {
      commands.push(command);
    }

    expect(commands).toHaveLength(0);
  });

  it.skip("should throw an error for invalid commands", async () => {
    const mockData = ["SOME_INVALID_COMMAND"];

    const mockStream = createMockStream(mockData);

    const io = new GridMovementFileBasedIO(
      mockStream,
      new GridMovementCommandParser()
    );

    const commands: GridMovementCommand[] = [];

    await expect(async () => {
      for await (const command of io) {
        commands.push(command);
      }
    }).rejects.toThrow(SyntaxError);
  });
});
