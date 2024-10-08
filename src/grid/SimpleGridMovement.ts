import { GridPosition } from "./GridPosition";
import {
  directions,
  Direction,
  GridMovement,
  MoveCommand,
  MovementCommand,
  TurnCommand,
} from "../types";

export class SimpleGridMovement implements GridMovement {
  applyCommand(
    position: GridPosition,
    direction: Direction,
    command: MovementCommand
  ) {
    switch (true) {
      case command instanceof MoveCommand:
        return {
          position: this.processMove(position, direction),
          direction,
        };
      case command instanceof TurnCommand:
        const delta = (command as TurnCommand).direction === "LEFT" ? -1 : 1;
        const index = directions.length + directions.indexOf(direction) + delta;

        return {
          direction: directions[index % directions.length],
          position,
        };
      default:
        return { position, direction };
    }
  }

  // Origin is bottom left
  private processMove(position: GridPosition, direction: Direction) {
    if (direction === "NORTH") {
      return new GridPosition(position.x, position.y + 1);
    }

    if (direction === "SOUTH") {
      return new GridPosition(position.x, position.y - 1);
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
