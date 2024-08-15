import { GridPosition } from "./cartesian/GridPosition";
import { directions } from "./directions";

export type Direction = (typeof directions)[number];

export interface GridMovement {
  applyCommand: (position: GridPosition, command: GridCommand) => GridPosition;
}

export interface Player {
  facing: Direction;
}

export type TurnDirection = "LEFT" | "RIGHT";

export class PlaceCommand {
  constructor(
    public readonly position: GridPosition,
    public readonly facing: Direction
  ) {}
}

export class TurnCommand {
  constructor(public readonly direction: TurnDirection) {}
}

export class MoveCommand {}
export class ReportCommand {}
export type SimpleGridMovementCommand = MoveCommand | TurnCommand;
export type GridCommand = PlaceCommand | SimpleGridMovementCommand;
export type GameCommand = GridCommand | ReportCommand;

export interface Parser<C> {
  parseLine: (line: string) => C;
}

export class CommandParsingError extends Error {}

export interface Serializable {
  serialize: () => string;
}

export interface Boundary<P> {
  isWithinBoundary: (position: P) => boolean;
}

export interface Logger {
  log: (text: string) => void;
}
