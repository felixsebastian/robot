import { Move, Place, Report, Turn } from "./GridMovementCommand";
import { GridMovementCommandParser } from "./GridMovementCommandParser";

describe("GridMovementCommandParser", () => {
  let parser: GridMovementCommandParser;

  beforeEach(() => {
    parser = new GridMovementCommandParser();
  });

  test('should return a Move command when input is "MOVE"', () => {
    const command = parser.parseLine("MOVE");
    expect(command).toBeInstanceOf(Move);
  });

  test('should return a Report command when input is "REPORT"', () => {
    const command = parser.parseLine("REPORT");
    expect(command).toBeInstanceOf(Report);
  });

  test('should return a Turn command when input is "LEFT"', () => {
    const command = parser.parseLine("LEFT");
    expect(command).toBeInstanceOf(Turn);
    expect((command as Turn).direction).toBe("LEFT");
  });

  test('should return a Turn command when input is "RIGHT"', () => {
    const command = parser.parseLine("RIGHT");
    expect(command).toBeInstanceOf(Turn);
    expect((command as Turn).direction).toBe("RIGHT");
  });

  test('should return a Place command when input is "PLACE 1,2,EAST"', () => {
    const command = parser.parseLine("PLACE 1,2,EAST");
    expect(command).toBeInstanceOf(Place);
    expect((command as Place).position.x).toBe(1);
    expect((command as Place).position.y).toBe(2);
    expect((command as Place).facing).toBe("EAST");
  });

  test("should throw an error when input is invalid", () => {
    expect(() => parser.parseLine("SOME_INVALID_COMMAND")).toThrowError();
  });
});
