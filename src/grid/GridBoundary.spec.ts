import { GridBoundary } from "./GridBoundary";
import { GridPosition } from "./GridPosition";

describe("GridBoundary", () => {
  let boundary: GridBoundary;

  beforeEach(() => {
    boundary = new GridBoundary(5, 5); // Example: 5x5 grid
  });

  it("should return true for positions within the boundary", () => {
    expect(boundary.isWithinBoundary(new GridPosition(2, 2))).toBe(true);
    expect(boundary.isWithinBoundary(new GridPosition(0, 0))).toBe(true);
    expect(boundary.isWithinBoundary(new GridPosition(4, 4))).toBe(true);
  });

  it("should return false for positions outside the boundary", () => {
    expect(boundary.isWithinBoundary(new GridPosition(-1, 2))).toBe(false); // Negative x
    expect(boundary.isWithinBoundary(new GridPosition(2, -1))).toBe(false); // Negative y
    expect(boundary.isWithinBoundary(new GridPosition(5, 2))).toBe(false); // x equals width
    expect(boundary.isWithinBoundary(new GridPosition(2, 5))).toBe(false); // y equals height
    expect(boundary.isWithinBoundary(new GridPosition(6, 6))).toBe(false); // Greater than width and height
  });

  it("should return true for positions on the boundary edges", () => {
    expect(boundary.isWithinBoundary(new GridPosition(0, 0))).toBe(true); // Top-left corner
    expect(boundary.isWithinBoundary(new GridPosition(4, 0))).toBe(true); // Top-right corner
    expect(boundary.isWithinBoundary(new GridPosition(0, 4))).toBe(true); // Bottom-left corner
    expect(boundary.isWithinBoundary(new GridPosition(4, 4))).toBe(true); // Bottom-right corner
  });

  it("should handle edge case of 1x1 grid", () => {
    const smallBoundary = new GridBoundary(1, 1);
    expect(smallBoundary.isWithinBoundary(new GridPosition(0, 0))).toBe(true);
    expect(smallBoundary.isWithinBoundary(new GridPosition(1, 0))).toBe(false);
    expect(smallBoundary.isWithinBoundary(new GridPosition(0, 1))).toBe(false);
    expect(smallBoundary.isWithinBoundary(new GridPosition(1, 1))).toBe(false);
  });

  it("should handle large grid boundaries", () => {
    const largeBoundary = new GridBoundary(1000, 1000);

    expect(largeBoundary.isWithinBoundary(new GridPosition(500, 500))).toBe(
      true
    );

    expect(largeBoundary.isWithinBoundary(new GridPosition(999, 999))).toBe(
      true
    );

    expect(largeBoundary.isWithinBoundary(new GridPosition(1000, 999))).toBe(
      false
    );

    expect(largeBoundary.isWithinBoundary(new GridPosition(999, 1000))).toBe(
      false
    );
  });
});
