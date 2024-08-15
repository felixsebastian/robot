import { GridPosition } from "./cartesian/GridPosition";
import { EnvironmentStore } from "./evironment/EnvironmentStore";
import {
  MoveCommand,
  GridMovement,
  PlaceCommand,
  TurnCommand,
  Player,
  Logger,
  GameCommand,
  ReportCommand,
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

  processCommand(command: GameCommand) {
    if (!this.initialized && !(command instanceof PlaceCommand)) return;
    const { facing } = this.player;

    switch (true) {
      case command instanceof PlaceCommand:
        const placeCommand = command as PlaceCommand;
        this.environment.placeObject(this.player, placeCommand.position);
        this.initialized = true;
        break;
      case command instanceof MoveCommand:
      case command instanceof TurnCommand:
        const currentPosition = this.environment.getObjectPosition(this.player);

        const result = this.movement.applyCommand(
          currentPosition,
          facing,
          command
        );

        this.environment.moveObject(this.player, result.position);
        this.player.facing = result.direction;
        break;
      case command instanceof ReportCommand:
        const { x, y } = this.environment.getObjectPosition(this.player);
        this.logger.log(`${x},${y},${this.player.facing}`);
    }
  }
}
