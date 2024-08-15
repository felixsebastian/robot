import { ParsedLineIO } from "./ParsedLineIO";
import { GridMovementCommandParser } from "./commands/GridMovementCommandParser";

async function main() {
  const parser = new GridMovementCommandParser();
  const io = new ParsedLineIO(process.stdin, parser);
  let result = "";

  for await (const command of io) {
    result += `${command.constructor.name}\n`;
  }

  console.log(result);
}

main();
