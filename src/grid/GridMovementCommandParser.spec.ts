import {
  MoveCommand,
  PlaceCommand,
  ReportCommand,
  TurnCommand,
} from "../types";
import { GridMovementCommandParser } from "./GridMovementCommandParser";

describe("GridMovementCommandParser", () => {
  let parser: GridMovementCommandParser;

  beforeEach(() => {
    parser = new GridMovementCommandParser();
  });

  test('should return a Move command when input is "MOVE"', () => {
    const command = parser.parseLine("MOVE");
    expect(command).toBeInstanceOf(MoveCommand);
  });

  test('should return a Report command when input is "REPORT"', () => {
    const command = parser.parseLine("REPORT");
    expect(command).toBeInstanceOf(ReportCommand);
  });

  test('should return a Turn command when input is "LEFT"', () => {
    const command = parser.parseLine("LEFT");
    expect(command).toBeInstanceOf(TurnCommand);
    expect((command as TurnCommand).direction).toBe("LEFT");
  });

  test('should return a Turn command when input is "RIGHT"', () => {
    const command = parser.parseLine("RIGHT");
    expect(command).toBeInstanceOf(TurnCommand);
    expect((command as TurnCommand).direction).toBe("RIGHT");
  });

  test('should return a Place command when input is "PLACE 1,2,EAST"', () => {
    const command = parser.parseLine("PLACE 1,2,EAST");
    expect(command).toBeInstanceOf(PlaceCommand);
    expect((command as PlaceCommand).position.x).toBe(1);
    expect((command as PlaceCommand).position.y).toBe(2);
    expect((command as PlaceCommand).facing).toBe("EAST");
  });

  test("should throw an error when input is invalid", () => {
    expect(() => parser.parseLine("SOME_INVALID_COMMAND")).toThrowError();
  });
});
