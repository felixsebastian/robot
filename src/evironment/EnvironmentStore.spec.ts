import { CartesianBoundary, GridPosition } from "../cartesian";
import { EnvironmentStore, PositionError } from "./EnvironmentStore";

class SomeClass {}

describe("EnvironmentStore", () => {
  let grid: EnvironmentStore<SomeClass, GridPosition>;

  beforeEach(() => {
    grid = new EnvironmentStore(new CartesianBoundary(3, 5));
  });

  describe("positionIsAvailable", () => {
    test("positionIsAvailable returns true if the position is within bounds and unoccupied", () => {
      expect(grid.positionIsAvailable(new GridPosition(2, 2))).toBe(true);
    });

    test("positionIsAvailable returns false if the position is out of bounds", () => {
      expect(grid.positionIsAvailable(new GridPosition(10, 10))).toBe(false);
    });

    test("positionIsAvailable returns false if the position is occupied", () => {
      grid.placeObject(new SomeClass(), new GridPosition(1, 1));
      expect(grid.positionIsAvailable(new GridPosition(1, 1))).toBe(false);
    });
  });

  describe("placeObject", () => {
    test("places the object if not already placed", () => {
      const someObject = new SomeClass();
      grid.placeObject(someObject, new GridPosition(1, 1));

      expect(grid.getObjectPosition(someObject).serialize()).toBe(
        new GridPosition(1, 1).serialize()
      );
    });

    test("moves the object if already placed", () => {
      const someObject = new SomeClass();
      grid.placeObject(someObject, new GridPosition(1, 1));
      grid.placeObject(someObject, new GridPosition(2, 2));

      expect(grid.getObjectPosition(someObject).serialize()).toBe(
        new GridPosition(2, 2).serialize()
      );

      expect(grid.positionIsAvailable(new GridPosition(1, 1))).toBe(true);
    });

    test("throws an error if the position is outside the grid", () => {
      expect(() => {
        grid.placeObject(new SomeClass(), new GridPosition(10, 10));
      }).toThrowError(PositionError);
    });
  });

  describe("moveObject", () => {
    test("is able to move an object if the move is valid", () => {
      const someObject = new SomeClass();
      grid.placeObject(someObject, new GridPosition(1, 1));
      grid.moveObject(someObject, new GridPosition(2, 2));
      expect(grid.getObject(new GridPosition(2, 2))).toBe(someObject);
      expect(grid.positionIsAvailable(new GridPosition(1, 1))).toBe(true);
    });

    test("throws an error if the destination is not available", () => {
      const someObject = new SomeClass();
      grid.placeObject(someObject, new GridPosition(1, 1));
      grid.placeObject("another object", new GridPosition(2, 2));

      expect(() => {
        grid.moveObject(someObject, new GridPosition(2, 2));
      }).toThrowError(PositionError);
    });

    test("throws an error if there is no object to move", () => {
      expect(() => {
        grid.moveObject(new SomeClass(), new GridPosition(2, 2));
      }).toThrowError(PositionError);
    });
  });

  describe("removeObject", () => {
    test("removes the object", () => {
      const someObject = new SomeClass();
      grid.placeObject(someObject, new GridPosition(1, 1));
      expect(grid.positionIsAvailable(new GridPosition(1, 1))).toBe(false);
      grid.removeObject(someObject);
      expect(grid.positionIsAvailable(new GridPosition(1, 1))).toBe(true);
    });

    test("throws an error if there is no object to remove", () => {
      expect(() => {
        grid.removeObject(new SomeClass());
      }).toThrowError(PositionError);
    });
  });

  describe("getObjectPosition", () => {
    test("can get the position of a newly placed object", () => {
      const someObject = new SomeClass();
      grid.placeObject(someObject, new GridPosition(2, 2));

      expect(grid.getObjectPosition(someObject).serialize()).toBe(
        new GridPosition(2, 2).serialize()
      );
    });

    test("updates the position when objects are moved", () => {
      const someObject = new SomeClass();
      grid.placeObject(someObject, new GridPosition(1, 1));
      grid.moveObject(someObject, new GridPosition(2, 2));

      expect(grid.getObjectPosition(someObject).serialize()).toBe(
        new GridPosition(2, 2).serialize()
      );
    });

    test("clears the position when objects are deleted", () => {
      const someObject = new SomeClass();
      grid.placeObject(someObject, new GridPosition(2, 2));
      grid.removeObject(someObject);

      expect(() => {
        grid.getObjectPosition(someObject);
      }).toThrowError(PositionError);
    });
  });

  describe("getObject", () => {
    test("places the object at the correct position", () => {
      const someObject = new SomeClass();
      grid.placeObject(someObject, new GridPosition(2, 2));
      expect(grid.getObject(new GridPosition(2, 2))).toBe(someObject);
    });
  });
});
