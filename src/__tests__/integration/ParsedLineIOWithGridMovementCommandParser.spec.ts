import {
  Move,
  Place,
  GridMovementCommand,
  Report,
  Turn,
} from "../../commands/GridMovementCommand";
import { GridMovementCommandParser } from "../../commands/GridMovementCommandParser";
import { ParsedLineIO } from "../../ParsedLineIO";
import { Readable } from "stream";

describe("Integration: ParsedLineIO with GridMovementCommandParser", () => {
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
    const mockStream = createMockStream([
      "PLACE 1,2,EAST",
      "MOVE",
      "MOVE",
      "LEFT",
      "MOVE",
      "REPORT",
    ]);

    const io = new ParsedLineIO(mockStream, new GridMovementCommandParser());
    const commands: GridMovementCommand[] = [];

    for await (const command of io) {
      commands.push(command);
    }

    expect(commands).toHaveLength(6);

    expect(commands[0]).toBeInstanceOf(Place);
    expect((commands[0] as Place).position.x).toBe(1);
    expect((commands[0] as Place).position.y).toBe(2);
    expect((commands[0] as Place).facing).toBe("EAST");

    expect(commands[1]).toBeInstanceOf(Move);
    expect(commands[2]).toBeInstanceOf(Move);

    expect(commands[3]).toBeInstanceOf(Turn);
    expect((commands[3] as Turn).direction).toBe("LEFT");

    expect(commands[4]).toBeInstanceOf(Move);
    expect(commands[5]).toBeInstanceOf(Report);
  });
});
