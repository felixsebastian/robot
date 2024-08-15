import {
  MoveCommand,
  PlaceCommand,
  GridCommand,
  ReportCommand,
  TurnCommand,
} from "../../types";
import { GridMovementCommandParser } from "../../io/GridMovementCommandParser";
import { ParsedLineIOManager } from "../../io/ParsedLineIOManager";
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

    const io = new ParsedLineIOManager(
      mockStream,
      new GridMovementCommandParser()
    );
    const commands: GridCommand[] = [];

    for await (const command of io) {
      commands.push(command);
    }

    expect(commands).toHaveLength(6);

    expect(commands[0]).toBeInstanceOf(PlaceCommand);
    expect((commands[0] as PlaceCommand).position.x).toBe(1);
    expect((commands[0] as PlaceCommand).position.y).toBe(2);
    expect((commands[0] as PlaceCommand).facing).toBe("EAST");

    expect(commands[1]).toBeInstanceOf(MoveCommand);
    expect(commands[2]).toBeInstanceOf(MoveCommand);

    expect(commands[3]).toBeInstanceOf(TurnCommand);
    expect((commands[3] as TurnCommand).direction).toBe("LEFT");

    expect(commands[4]).toBeInstanceOf(MoveCommand);
    expect(commands[5]).toBeInstanceOf(ReportCommand);
  });
});
