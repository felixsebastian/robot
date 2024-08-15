import { ParsedLineIOManager } from "./io/ParsedLineIOManager";
import { GridMovementCommandParser } from "./grid/GridMovementCommandParser";
import { GridBoundary } from "./grid/GridBoundary";
import { GridGameController } from "./controller";
import { EnvironmentStore } from "./evironment/EnvironmentStore";
import { SimpleGridMovement } from "./grid/SimpleGridMovement";
import { Player } from "./types";
import { GridPosition } from "./grid/GridPosition";
import { Robot } from "./robot";
import { CliLineReader } from "./io/CliLineReader";
import { ConsoleLogger } from "./io/ConsoleLogger";

async function main() {
  const parser = new GridMovementCommandParser();
  const logger = new ConsoleLogger();
  const cliReader = new CliLineReader(logger);
  const commands = new ParsedLineIOManager(cliReader, parser, logger);
  const boundary = new GridBoundary(5, 5);
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
}

main();
