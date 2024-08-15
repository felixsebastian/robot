import { GridPosition } from "../cartesian/GridPosition";
import { GridCommand, GridMovement } from "../types";

export class SimpleGridMovement implements GridMovement {
  applyCommand(position: GridPosition, command: GridCommand) {
    return position;
  }
}
