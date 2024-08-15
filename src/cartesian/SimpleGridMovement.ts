import { GridPosition } from "./GridPosition";
import {
  Direction,
  GridCommand,
  GridMovement,
  MoveCommand,
  TurnCommand,
} from "../types";
import { directions } from "../directions";

export class SimpleGridMovement implements GridMovement {
  applyCommand(
    position: GridPosition,
    direction: Direction,
    command: GridCommand
  ) {
    switch (true) {
      case command instanceof MoveCommand:
        return {
          position: this.processMove(position, direction),
          direction,
        };
      case command instanceof TurnCommand:
        const delta = command.direction === "LEFT" ? -1 : 1;
        const index = directions.indexOf(direction) + delta;

        return {
          direction: directions[index % directions.length],
          position,
        };
      default:
        return { position, direction };
    }
  }

  private processMove(position: GridPosition, direction: Direction) {
    if (direction === "NORTH") {
      return new GridPosition(position.x, position.y - 1);
    }

    if (direction === "SOUTH") {
      return new GridPosition(position.x, position.y + 1);
    }

    if (direction === "WEST") {
      return new GridPosition(position.x - 1, position.y);
    }

    if (direction === "EAST") {
      return new GridPosition(position.x + 1, position.y);
    }

    return position;
  }
}
