import { ParsedLineIOManager } from "./io/ParsedLineIOManager";
import { GridMovementCommandParser } from "./io/GridMovementCommandParser";
import { CartesianBoundary } from "./cartesian/CartesianBoundary";
import { MemoryLogger } from "./io/MemoryLogger";
import { GridGameController } from "./controller";
import { EnvironmentStore } from "./evironment/EnvironmentStore";
import { SimpleGridMovement } from "./cartesian/SimpleGridMovement";
import { Player } from "./types";
import { GridPosition } from "./cartesian/GridPosition";
import { Robot } from "./robot";

async function main() {
  const parser = new GridMovementCommandParser();
  const commands = new ParsedLineIOManager(process.stdin, parser);
  const boundary = new CartesianBoundary(10, 10);
  const logger = new MemoryLogger();
  const environment = new EnvironmentStore<Player, GridPosition>(boundary);
  const movement = new SimpleGridMovement();
  const robot = new Robot();

  const controller = new GridGameController(
    environment,
    robot,
    movement,
    logger
  );

  for await (const command of commands) {
    controller.processCommand(command);
  }

  console.log(logger.state);
}

main();
