import { GridEnvironment, GridError } from "./GridEnvironment";

describe("GridEnvironment", () => {
  let grid: GridEnvironment<string>;

  beforeEach(() => {
    grid = new GridEnvironment({ width: 3, height: 5 });
  });

  test("initializes the grid with given width and height", () => {
    expect(grid.width).toBe(3);
    expect(grid.height).toBe(5);
  });

  describe("positionIsAvailable", () => {
    test("positionIsAvailable returns true if the position is within bounds and unoccupied", () => {
      const position = { x: 2, y: 2 };
      expect(grid.positionIsAvailable(position)).toBe(true);
    });

    test("positionIsAvailable returns false if the position is out of bounds", () => {
      const outOfBoundsPosition = { x: 10, y: 10 };
      expect(grid.positionIsAvailable(outOfBoundsPosition)).toBe(false);
    });

    test("positionIsAvailable returns false if the position is occupied", () => {
      grid.placeObject({ x: 1, y: 1 }, "some object");
      expect(grid.positionIsAvailable({ x: 1, y: 1 })).toBe(false);
    });
  });

  describe("placeObject", () => {
    test("throws an error if the position is outside the grid", () => {
      expect(() => {
        grid.placeObject({ x: 10, y: 10 }, "some object");
      }).toThrowError(GridError);
    });
  });

  describe("getObject", () => {
    test("places the object at the correct position", () => {
      grid.placeObject({ x: 2, y: 2 }, "some object");
      expect(grid.getObject({ x: 2, y: 2 })).toBe("some object");
    });
  });
});
