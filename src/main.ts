import { GridMovementFileBasedIO } from "./io/GridMovementFileBasedIO";
import { GridMovementCommandParser } from "./io/GridMovementCommandParser";

async function main() {
  const parser = new GridMovementCommandParser();
  const io = new GridMovementFileBasedIO(process.stdin, parser);
  let result = "";

  for await (const command of io) {
    result += `${command.constructor.name}\n`;
  }

  console.log(result);
}

main();
