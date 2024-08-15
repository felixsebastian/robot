import {
  Direction,
  Facing,
  Move,
  Place,
  Report,
  Turn,
} from "./GridMovementCommand";

class FileBasedIOError extends Error {}

export class GridMovementCommandParser {
  private readonly COMMAND_PATTERNS = [
    { regex: /^MOVE$/, type: "MOVE" } as const,
    {
      regex: /^PLACE (\d+),(\d+),(NORTH|SOUTH|EAST|WEST)$/,
      type: "PLACE",
    } as const,
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
      throw new FileBasedIOError(`invalid command found in file: ${line}`);
    }

    switch (matchingPattern.type) {
      case "MOVE":
        return new Move();
      case "TURN":
        return new Turn(matchArray[0] as Direction);
      case "REPORT":
        return new Report();
      case "PLACE":
        return new Place(
          { x: parseInt(matchArray[1], 10), y: parseInt(matchArray[2], 10) },
          matchArray[3] as Facing
        );
      default:
        const exhaustiveCheck: never = matchingPattern;
        throw new Error(`unhandled direction: ${exhaustiveCheck}`);
    }
  }
}
