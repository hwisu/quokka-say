import { Command } from '@cliffy/command';
import { formatQuokka } from './quokka.ts';

/**
 * ANSI color codes for terminal color output
 */
export const colors = {
  reset: '\x1b[0m',

  // Regular colors
  red: '\x1b[31m',
  orange: '\x1b[38;5;208m', // Using 256-color mode for orange
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  indigo: '\x1b[38;5;93m', // Using 256-color mode for indigo
  violet: '\x1b[38;5;165m', // Using 256-color mode for violet
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  black: '\x1b[30m',
};

/**
 * Available color names type definition
 */
export type ColorName = keyof typeof colors;

/**
 * Display mode type definition
 */
export type DisplayMode = 'auto' | 'top' | 'side' | 'bottom';

/**
 * Rainbow mode type definition
 */
export type RainbowMode = 'char' | 'line' | boolean;

/**
 * Rainbow colors in sequence (ROYGBIV)
 */
const rainbowColors: ColorName[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'violet',
];

/**
 * Apply color to text
 * @param text - Text to colorize
 * @param color - Color name from the available colors
 * @returns Colorized text with appropriate ANSI codes
 */
export function colorize(text: string, color: ColorName): string {
  return (color === 'reset' || !(color in colors))
    ? text
    : `${colors[color]}${text}${colors.reset}`;
}

/**
 * Apply rainbow colors to text, with each character having a different color
 * @param text - Text to colorize
 * @returns Rainbow-colorized text with character-by-character coloring
 */
export function rainbowize(text: string): string {
  return text
    .split('')
    .map((char, index) => {
      const colorIndex = index % rainbowColors.length;
      return colorize(char, rainbowColors[colorIndex]);
    })
    .join('');
}

/**
 * Apply rainbow colors to text, with each line having a different color
 * @param text - Text to colorize (can contain multiple lines)
 * @returns Rainbow-colorized text with line-by-line coloring
 */
function rainbowizeByLine(text: string): string {
  const lines = text.split('\n');
  const totalLines = lines.length;

  // Calculate how many lines should have the same color
  const linesPerColor = Math.ceil(totalLines / rainbowColors.length);

  return lines
    .map((line, index) => {
      const colorIndex = Math.floor(index / linesPerColor);
      return colorize(line, rainbowColors[colorIndex] || 'reset');
    })
    .join('\n');
}

/**
 * Command options interface for type safety
 */
interface QuokkaOptions {
  rainbow: RainbowMode | string;
  color?: string;
  display?: DisplayMode | string;
}

/**
 * Read text from stdin if available
 * @returns Promise with the text from stdin, or empty string if none
 */
async function readFromStdin(): Promise<string> {
  // Check if we're reading from a pipe
  const hasStdin = !Deno.stdin.isTerminal();

  if (!hasStdin) {
    return '';
  }

  const decoder = new TextDecoder();
  const buffer = new Uint8Array(1024);
  let text = '';

  try {
    while (true) {
      const readResult = await Deno.stdin.read(buffer);
      if (readResult === null) break;

      text += decoder.decode(buffer.subarray(0, readResult));

      // If we didn't fill the buffer, we're done
      if (readResult < buffer.length) break;
    }

    return text.trim();
  } catch (error) {
    console.error(
      'Error reading from stdin:',
      error instanceof Error ? error.message : String(error),
    );
    return '';
  }
}

/**
 * Apply color to the quokka text based on the provided options
 * @param quokkaText The formatted quokka text
 * @param options Command options containing color preferences
 * @returns Colored quokka text
 */
function applyColor(quokkaText: string, options: QuokkaOptions): string {
  if (options.rainbow) {
    const rainbowMode = options.rainbow as RainbowMode;
    if (rainbowMode === 'line') {
      return rainbowizeByLine(quokkaText);
    } else {
      // For boolean true or 'char' or any other value, use character mode
      return rainbowize(quokkaText);
    }
  }

  return options.color ? colorize(quokkaText, options.color as ColorName) : quokkaText;
}

/**
 * Process input text through the quokka pipeline
 * @param options Command options
 * @param message Optional input message
 * @returns Promise with the final colored quokka text
 */
async function processQuokka(options: QuokkaOptions, message?: string): Promise<string> {
  try {
    // Priority: 1. Provided message, 2. Stdin, 3. Fortune, 4. Default message
    const text = message ||
      await readFromStdin() ||
      "Hello, I'm a quokka!";

    // Format with the display mode option
    const quokkaText = formatQuokka(text, options.display as DisplayMode || 'auto');

    return applyColor(quokkaText, options);
  } catch (error) {
    console.error(
      'Error processing quokka:',
      error instanceof Error ? error.message : String(error),
    );
    Deno.exit(1);
  }
}

// Define the main command
const command = new Command()
  .name('quokka-say')
  .version('0.1.6')
  .description('A modern implementation of cowsay but with a quokka character')
  .option(
    '-r, --rainbow <mode:string>',
    'Use rainbow colors (char, line)',
    { default: false },
  )
  .option(
    '-c, --color <color:string>',
    'Color of the output (red, green, yellow, blue, magenta, cyan, orange, indigo, violet)',
  )
  .option(
    '-d, --display <mode:string>',
    'Display mode (auto, top, side, bottom)',
    { default: 'auto' },
  )
  .arguments('[message:string]')
  .action(async (options: QuokkaOptions, message?: string) => {
    // Validate display mode
    const validModes: DisplayMode[] = ['auto', 'top', 'side', 'bottom'];
    if (options.display && !validModes.includes(options.display as DisplayMode)) {
      console.error('Error: Display mode must be "auto", "top", "side", or "bottom"');
      Deno.exit(1);
    }

    // Process quokka text
    const coloredText = await processQuokka(options, message);
    console.log(coloredText);
  });

/**
 * Run the CLI command
 */
export async function runCli(args: string[] = Deno.args): Promise<void> {
  try {
    await command.parse(args);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    Deno.exit(1);
  }
}

// Run CLI when this module is executed directly
if (import.meta.main) {
  runCli();
}

// Default export for module
export default {
  runCli,
};
