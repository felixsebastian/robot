# Toy Robot Game

## Running the code

Install dependencies with `npx pnpm i`, and start the program with `npm start`.

The program reads directly from stdin by default. So you probably want to do something like `cat ./data/1.txt | npm start`. It can easily be reconfigured to read data from any source.

Run the tests with `npm run test`.

## Notes about the design

If you look at the main.ts file you will see that the whole program is highly decoupled. One of the main cross-cutting concerns is the concept of a 2d cartesian grid. I've taken extra care to make sure this could easily be switched out with any positioning system, such as a hexagonal grid, or 3d space.
