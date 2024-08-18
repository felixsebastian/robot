# Toy Robot Game

## Running the code

Install dependencies with `npx pnpm i`, and start the program with `npm start`.

Run the tests with `npm run test`.

## Usage

By default the program will wait for your input and allow you to type in commands. If you specify a filename, it will look for files relative to the `./data` directory. So for example `npm start 1.txt` will run the `./data/1.txt` file as input.

## Notes about the design

If you look at the main.ts file you will see that the whole program is highly decoupled. One of the main cross-cutting concerns is the concept of a 2d cartesian grid. I've taken extra care to make sure this could easily be switched out with any positioning system, such as a hexagonal grid, or 3d space. Only the parts of the program which need to be grid-aware are so, and live in the ./src/grid directory.

Similarly for IO. This program comes with a CliLineReader class, which reads lines from the CLI, and a FileLineReader which reads from files. But you can easily pass any ReadStream compatible object such as stdin to the IOManager.

With these 2 main concerns nicely decoupled and abstracted away, the only thing that remains is keeping track of which direction the player is facing. This is not inherently tied to the grid concept. This bit lives in the controller, it's basically 1 line of code. I would say it almost deserves its own class.

I would have liked to spend a bit more time thinking about folder structure and code organisation, but alas I am too busy.

I also would've liked to spend more time writing integration tests.

## Performance

I haven't spent much time performance testing this program, but all of the input should be buffered so I believe it would handle massive inputs without much issue. I did try running with a file of a few million lines and it looked fine, but would need to be properly analysed.
