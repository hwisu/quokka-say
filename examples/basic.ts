// Basic usage example for quokka-say
import { formatQuokka } from "../src/quokka.ts";
import { colorize, rainbowize, rainbowizeByLine } from "../src/colors.ts";

// Basic usage
console.log("\n=== Basic Usage ===\n");
console.log(formatQuokka("Hello from quokka-say!"));

// With colors
console.log("\n=== With Colors ===\n");
console.log(colorize(formatQuokka("I'm blue!"), "blue"));
console.log(colorize(formatQuokka("I'm green!"), "green"));

// With rainbow
console.log("\n=== With Rainbow ===\n");
console.log(rainbowize(formatQuokka("Rainbow characters!")));

// With rainbow by line
console.log("\n=== With Rainbow By Line ===\n");
console.log(rainbowizeByLine(formatQuokka("Rainbow\nby\nlines!")));

// With multi-line message
console.log("\n=== With Multi-line Message ===\n");
console.log(formatQuokka(`This is a multi-line message.
It has several paragraphs.

And even some spacing between them!

1. It can handle numbered lists
2. With multiple points
3. Like this one`));
