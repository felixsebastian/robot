export interface Position {
  x: number;
  y: number;
}

export type Facing = "NORTH" | "SOUTH" | "EAST" | "WEST";
export type Direction = "LEFT" | "RIGHT";

export class Place {
  constructor(
    public readonly position: Position,
    public readonly facing: Facing
  ) {}
}

export class Move {}

export class Turn {
  constructor(public readonly direction: Direction) {}
}

export class Report {}

export type GridMovementCommand = Place | Move | Turn | Report;
