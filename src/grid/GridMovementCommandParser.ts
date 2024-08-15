import { GridPosition } from "../grid/GridPosition";
import {
  CommandParsingError,
  TurnDirection,
  Direction,
  MoveCommand,
  PlaceCommand,
  ReportCommand,
  TurnCommand,
} from "../types";

// This class takes string commands and converts them into command objects.
// Parses input quite strictly.
// Different casing or whitespace will cause errors to be thrown.
export class GridMovementCommandParser {
  private readonly COMMAND_PATTERNS = [
    {
      regex: /^PLACE (\d+),(\d+),(NORTH|SOUTH|EAST|WEST)$/,
      type: "PLACE",
    } as const,
    { regex: /^MOVE$/, type: "MOVE" } as const,
    { regex: /^LEFT$/, type: "TURN" } as const,
    { regex: /^RIGHT$/, type: "TURN" } as const,
    { regex: /^REPORT$/, type: "REPORT" } as const,
  ];

  parseLine(line: string) {
    type SourceCommandTypes = (typeof this.COMMAND_PATTERNS)[number];
    let matchingPattern: SourceCommandTypes | null = null;
    let matchArray: RegExpMatchArray | null = null;

    for (const pattern of this.COMMAND_PATTERNS) {
      const test = line.match(pattern.regex);

      if (test) {
        matchingPattern = pattern;
        matchArray = test;
        break;
      }
    }

    if (!matchingPattern || !matchArray) {
      throw new CommandParsingError(`invalid command found in file: ${line}`);
    }

    switch (matchingPattern.type) {
      case "MOVE":
        return new MoveCommand();
      case "TURN":
        return new TurnCommand(matchArray[0] as TurnDirection);
      case "REPORT":
        return new ReportCommand();
      case "PLACE":
        return new PlaceCommand(
          new GridPosition(
            parseInt(matchArray[1], 10),
            parseInt(matchArray[2], 10)
          ),
          matchArray[3] as Direction
        );
      default:
        const exhaustiveCheck: never = matchingPattern;
        throw new Error(`unhandled direction: ${exhaustiveCheck}`);
    }
  }
}
