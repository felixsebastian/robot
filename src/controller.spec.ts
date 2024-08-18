import { GridGameController } from "./controller";
import { GridPosition } from "./grid/GridPosition";
import { EnvironmentStore } from "./evironment/EnvironmentStore";
import {
  MoveCommand,
  GridMovement,
  PlaceCommand,
  Player,
  Logger,
  ReportCommand,
} from "./types";

describe("GridGameController", () => {
  let environment: jest.Mocked<EnvironmentStore<Player, GridPosition>>;
  let player: Player;
  let movement: jest.Mocked<GridMovement>;
  let logger: jest.Mocked<Logger>;
  let controller: GridGameController;

  beforeEach(() => {
    // Mock the dependencies
    environment = {
      getObjectPosition: jest.fn(),
      positionIsAvailable: jest.fn(),
      placeObject: jest.fn(),
      moveObject: jest.fn(),
    } as unknown as jest.Mocked<EnvironmentStore<Player, GridPosition>>;

    player = { facing: "NORTH" } as Player;

    movement = {
      applyCommand: jest.fn(),
    } as unknown as jest.Mocked<GridMovement>;
    logger = {
      log: jest.fn(),
    } as jest.Mocked<Logger>;

    controller = new GridGameController(environment, player, movement, logger);
  });

  it("should not process any command if not initialized except PlaceCommand", () => {
    const moveCommand = new MoveCommand();
    controller.processCommand(moveCommand);
    expect(environment.placeObject).not.toHaveBeenCalled();
    expect(environment.moveObject).not.toHaveBeenCalled();
  });

  it("should initialize and place player on valid position with PlaceCommand", () => {
    const placeCommand = new PlaceCommand(new GridPosition(1, 1), "EAST");
    environment.positionIsAvailable.mockReturnValue(true);
    controller.processCommand(placeCommand);
    expect(player.facing).toBe("EAST");

    expect(environment.placeObject).toHaveBeenCalledWith(
      player,
      placeCommand.position
    );

    expect(logger.log).not.toHaveBeenCalled();
  });

  it("should log error if PlaceCommand is given but position is not available", () => {
    const placeCommand = new PlaceCommand(new GridPosition(1, 1), "EAST");
    environment.positionIsAvailable.mockReturnValue(false);
    controller.processCommand(placeCommand);
    expect(logger.log).toHaveBeenCalledWith("Cannot go there!");
    expect(environment.placeObject).not.toHaveBeenCalled();
  });

  it("should apply movement command when initialized", () => {
    const placeCommand = new PlaceCommand(new GridPosition(1, 1), "EAST");
    const moveCommand = new MoveCommand();
    environment.positionIsAvailable.mockReturnValue(true);
    environment.getObjectPosition.mockReturnValue(new GridPosition(1, 1));

    movement.applyCommand.mockReturnValue({
      position: new GridPosition(2, 1),
      direction: "NORTH",
    });

    controller.processCommand(placeCommand); // Initialize
    controller.processCommand(moveCommand);

    expect(movement.applyCommand).toHaveBeenCalledWith(
      new GridPosition(1, 1),
      "EAST",
      moveCommand
    );

    expect(environment.moveObject).toHaveBeenCalledWith(
      player,
      new GridPosition(2, 1)
    );

    expect(player.facing).toBe("NORTH");
  });

  it("should log error if MoveCommand is given but position is not available", () => {
    const placeCommand = new PlaceCommand(new GridPosition(1, 1), "EAST");
    const moveCommand = new MoveCommand();

    environment.positionIsAvailable.mockReturnValueOnce(true); // for place
    environment.positionIsAvailable.mockReturnValueOnce(false); // for move
    environment.getObjectPosition.mockReturnValue(new GridPosition(1, 1));

    movement.applyCommand.mockReturnValue({
      position: new GridPosition(2, 1),
      direction: "NORTH",
    });

    controller.processCommand(placeCommand); // Initialize
    controller.processCommand(moveCommand);
    expect(logger.log).toHaveBeenCalledWith("Cannot go there!");
    expect(environment.moveObject).not.toHaveBeenCalled();
  });

  it("should log current position and facing direction with ReportCommand", () => {
    const placeCommand = new PlaceCommand(new GridPosition(1, 1), "EAST");
    const reportCommand = new ReportCommand();
    environment.getObjectPosition.mockReturnValue(new GridPosition(1, 1));
    controller.processCommand(placeCommand); // Initialize
    controller.processCommand(reportCommand);
    expect(logger.log).toHaveBeenCalledWith("1,1,EAST");
  });
});
