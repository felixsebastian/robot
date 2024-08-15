import { GridPosition } from "./cartesian/GridPosition";
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

// The main purpose of the controller is to route commands to the right object.
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
    const currentPosition = this.environment.getObjectPosition(this.player);
    const { facing } = this.player;

    switch (true) {
      case command instanceof PlaceCommand:
        this.environment.placeObject(this.player, command.position);
        break;
      case command instanceof MoveCommand:
      case command instanceof TurnCommand:
        const result = this.movement.applyCommand(
          currentPosition,
          facing,
          command
        );

        this.environment.moveObject(this.player, result.position);
        this.player.facing = result.direction;
      case command instanceof Report:
        const { x, y } = currentPosition;
        this.logger.log(`${x},${y},${this.player.facing}`);
    }
  }
}
