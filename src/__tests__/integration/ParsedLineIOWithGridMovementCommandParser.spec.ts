import {
  GameCommand,
  MoveCommand,
  PlaceCommand,
  ReportCommand,
  TurnCommand,
} from "../../types";
import { ParsedLineIOManager } from "../../io/ParsedLineIOManager";
import { Readable } from "stream";
import { GridMovementCommandParser } from "../../grid/GridMovementCommandParser";

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

    const commandStream = new ParsedLineIOManager<GameCommand>(
      mockStream,
      new GridMovementCommandParser()
    );

    const commands: GameCommand[] = [];

    for await (const command of commandStream) {
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
