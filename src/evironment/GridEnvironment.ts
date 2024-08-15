import { Environment } from "./Environment";

interface Position {
  x: number;
  y: number;
}

interface GridSpecification {
  width: number;
  height: number;
}

export class GridError extends Error {}

export class GridEnvironment<O> implements Environment<Position, O> {
  public width: number;
  public height: number;
  private readonly objects: Map<string, O>;

  constructor(specification: GridSpecification) {
    this.width = specification.width;
    this.height = specification.height;
    this.objects = new Map();
  }

  positionIsAvailable(position: Position) {
    return this.getObject(position) === null && this.isWithinGrid(position);
  }

  placeObject(position: Position, object: O) {
    if (!this.positionIsAvailable(position)) {
      throw new GridError("position not available");
    }

    this.objects.set(this.serializePosition(position), object);
  }

  getObject(position: Position) {
    const object = this.objects.get(this.serializePosition(position));
    return object ?? null;
  }

  private isWithinGrid({ x, y }: Position) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  private serializePosition(position: Position) {
    return `${position.x}_${position.y}`;
  }
}
