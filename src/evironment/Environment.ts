export interface Environment<P, O> {
  positionIsAvailable: (position: P) => boolean;
  placeObject: (position: P, object: O) => void;
}
