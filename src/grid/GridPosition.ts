import { Serializable } from "../types";

export class GridPosition implements Serializable {
  constructor(public readonly x: number, public readonly y: number) {}

  serialize() {
    return `${this.x}_${this.y}`;
  }
}
