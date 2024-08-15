import { Direction, GridPosition } from "./types";

export class GridRobot {
  public readonly position: GridPosition = { x: 0, y: 0 };
  public readonly facing: Direction = "NORTH";
}
