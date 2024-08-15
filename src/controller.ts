import { GridPosition } from "./cartesian/GridPosition";
import { directions } from "./directions";
import { EnvironmentStore } from "./evironment/EnvironmentStore";
import {
  GridCommand,
  MoveCommand,
  GridMovement,
  PlaceCommand,
  TurnCommand,
  Player,
  Logger,
} from "./types";

export class GridGameController {
  private initialized = false;

  constructor(
    private readonly environment: EnvironmentStore<Player, GridPosition>,
    private readonly player: Player,
    private readonly movement: GridMovement,
    private readonly logger: Logger
  ) {}

  processCommand(command: GridCommand) {
    if (!this.initialized && !(command instanceof PlaceCommand)) return;

    switch (true) {
      case command instanceof PlaceCommand:
        this.environment.placeObject(this.player, command.position);
        break;
      case command instanceof MoveCommand:
        const currentPosition = this.environment.getObjectPosition(this.player);

        const newPosition = this.movement.applyCommand(
          currentPosition,
          command
        );

        this.environment.moveObject(this.player, newPosition);
        break;
      case command instanceof TurnCommand:
        const delta = command.direction === "LEFT" ? -1 : 1;
        const index = directions.indexOf(this.player.facing) + delta;
        this.player.facing = directions[index % directions.length];
      case command instanceof Report:
        this.logger.log("hi");
    }
  }
}
