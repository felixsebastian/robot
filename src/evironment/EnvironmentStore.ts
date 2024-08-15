import { Boundary, PositionError, Serializable } from "../types";

// EnvironmentStore is a kind of hybrid data structure.
// It is designed to keep track of objects and their positions.
// It can be used with a boundary which will make some positions invalid.
// This could be used to keep track of objects in grid space, among others.
export class EnvironmentStore<O, P extends Serializable> {
  private readonly objectsByPosition: Map<string, O> = new Map();
  private readonly positionsByObject: Map<O, P> = new Map();
  constructor(private readonly boundary?: Boundary<P>) {}

  positionIsAvailable(position: P) {
    const withinBoundary = this.boundary?.isWithinBoundary(position) ?? true;
    return this.getObject(position) === null && withinBoundary;
  }

  placeObject(object: O, newPosition: P) {
    if (!this.positionIsAvailable(newPosition)) {
      throw new PositionError("position not available");
    }

    const currentPosition = this.positionsByObject.get(object);

    if (currentPosition) {
      this.moveObject(object, newPosition);
      return;
    }

    this.objectsByPosition.set(newPosition.serialize(), object);
    this.positionsByObject.set(object, newPosition);
  }

  removeObject(object: O) {
    const position = this.getObjectPosition(object);
    this.objectsByPosition.delete(position.serialize());
    this.positionsByObject.delete(object);
  }

  moveObject(object: O, newPosition: P) {
    this.removeObject(object);
    this.placeObject(object, newPosition);
  }

  getObject(position: P) {
    const object = this.objectsByPosition.get(position.serialize());
    return object ?? null;
  }

  getObjectPosition(object: O) {
    const position = this.positionsByObject.get(object);
    if (!position) throw new PositionError("no object there");
    return position;
  }
}
