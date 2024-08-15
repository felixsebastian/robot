import { GridPosition } from "./grid/GridPosition";
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
  MovementCommand,
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

    switch (true) {
      case command instanceof PlaceCommand:
        this.applyPlaceCommand(command as PlaceCommand);
        break;
      case command instanceof MoveCommand:
      case command instanceof TurnCommand:
        this.applyMovementCommands(command as MovementCommand);
        break;
      case command instanceof ReportCommand:
        const { x, y } = this.environment.getObjectPosition(this.player);
        this.logger.log(`${x},${y},${this.player.facing}`);
    }
  }

  applyPlaceCommand({ facing, position }: PlaceCommand) {
    this.player.facing = facing;

    if (this.environment.positionIsAvailable(position)) {
      this.environment.placeObject(this.player, position);
    } else {
      this.logger.log("Cannot go there!");
    }

    this.initialized = true;
  }

  applyMovementCommands(command: MovementCommand) {
    const { facing } = this.player;
    const currentPosition = this.environment.getObjectPosition(this.player);

    const { position, direction } = this.movement.applyCommand(
      currentPosition,
      facing,
      command
    );

    if (this.environment.positionIsAvailable(position)) {
      this.environment.moveObject(this.player, position);
    } else if (command instanceof MoveCommand) {
      this.logger.log("Cannot go there!");
    }

    this.player.facing = direction;
  }
}
