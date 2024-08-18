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
import { FileLineReader } from "./io/FileLineReader";
import { join } from "path";
import { Readable } from "stream";

async function main() {
  const filename = process.argv[2];
  const parser = new GridMovementCommandParser();
  const logger = new ConsoleLogger();

  let reader: Readable;

  if (filename) {
    reader = new FileLineReader(join(__dirname, "..", "data", filename));
  } else {
    reader = new CliLineReader(logger);
  }

  const commands = new ParsedLineIOManager(reader, parser, logger);
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
