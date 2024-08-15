import { Boundary } from "../types";
import { GridPosition } from "./GridPosition";

export class CartesianBoundary implements Boundary<GridPosition> {
  constructor(
    private readonly width: number,
    private readonly height: number
  ) {}

  isWithinBoundary({ x, y }: GridPosition) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
}
