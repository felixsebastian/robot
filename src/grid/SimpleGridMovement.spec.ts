import { MoveCommand, TurnCommand } from "../types";
import { GridPosition } from "./GridPosition";
import { SimpleGridMovement } from "./SimpleGridMovement";

describe("SimpleGridMovement", () => {
  const simpleGridMovement = new SimpleGridMovement();

  describe("applyCommand", () => {
    test("moving north should go up", () => {
      const result = simpleGridMovement.applyCommand(
        new GridPosition(2, 2),
        "NORTH",
        new MoveCommand()
      );

      expect(result.position.serialize()).toBe(
        new GridPosition(2, 1).serialize()
      );

      expect(result.direction).toBe("NORTH");
    });

    test("moving south should go down", () => {
      const result = simpleGridMovement.applyCommand(
        new GridPosition(2, 2),
        "SOUTH",
        new MoveCommand()
      );

      expect(result.position.serialize()).toBe(
        new GridPosition(2, 3).serialize()
      );

      expect(result.direction).toBe("SOUTH");
    });

    test("moving east should go right", () => {
      const result = simpleGridMovement.applyCommand(
        new GridPosition(2, 2),
        "EAST",
        new MoveCommand()
      );

      expect(result.position.serialize()).toBe(
        new GridPosition(3, 2).serialize()
      );

      expect(result.direction).toBe("EAST");
    });

    test("moving west should go left", () => {
      const result = simpleGridMovement.applyCommand(
        new GridPosition(2, 2),
        "WEST",
        new MoveCommand()
      );

      expect(result.position.serialize()).toBe(
        new GridPosition(1, 2).serialize()
      );

      expect(result.direction).toBe("WEST");
    });

    test("turning right from north", () => {
      const result = simpleGridMovement.applyCommand(
        new GridPosition(2, 2),
        "NORTH",
        new TurnCommand("RIGHT")
      );

      expect(result.position.serialize()).toBe(
        new GridPosition(2, 2).serialize()
      );

      expect(result.direction).toBe("EAST");
    });

    test("turning left from north", () => {
      const result = simpleGridMovement.applyCommand(
        new GridPosition(2, 2),
        "NORTH",
        new TurnCommand("LEFT")
      );

      expect(result.position.serialize()).toBe(
        new GridPosition(2, 2).serialize()
      );

      expect(result.direction).toBe("WEST");
    });

    test("turning right from west", () => {
      const result = simpleGridMovement.applyCommand(
        new GridPosition(2, 2),
        "WEST",
        new TurnCommand("RIGHT")
      );

      expect(result.position.serialize()).toBe(
        new GridPosition(2, 2).serialize()
      );

      expect(result.direction).toBe("NORTH");
    });

    test("turning left from west", () => {
      const result = simpleGridMovement.applyCommand(
        new GridPosition(2, 2),
        "WEST",
        new TurnCommand("LEFT")
      );

      expect(result.position.serialize()).toBe(
        new GridPosition(2, 2).serialize()
      );

      expect(result.direction).toBe("SOUTH");
    });
  });
});
