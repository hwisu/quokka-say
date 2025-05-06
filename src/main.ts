import { Command } from '@cliffy/command';
import { formatQuokka } from './quokka.ts';
import { colorize, ColorName, rainbowize, rainbowizeByLine } from './colors.ts';

/**
 * Command options interface for type safety
 */
interface QuokkaOptions {
  rainbow: string | boolean;
  color?: string;
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
    console.error('Error reading from stdin:', error instanceof Error ? error.message : String(error));
    return '';
  }
}

/**
 * Check if fortune program is available and get a fortune quote
 * @returns Promise with the fortune text, or empty string if not available
 */
async function tryGetFortune(): Promise<string> {
  try {
    // Try to run the fortune command
    const command = new Deno.Command('fortune', {
      args: ['-s'], // -s for short fortunes
      stdout: 'piped',
      stderr: 'piped',
    });

    const { success, stdout } = await command.output();
    return success ? new TextDecoder().decode(stdout).trim() : '';
  } catch {
    // Fortune command not found or error running it - silently fail
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
    return options.rainbow === 'line'
      ? rainbowizeByLine(quokkaText)
      : rainbowize(quokkaText);
  }

  return options.color
    ? colorize(quokkaText, options.color as ColorName)
    : quokkaText;
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
                await tryGetFortune() ||
                'Hello, I\'m a quokka!';

    return applyColor(formatQuokka(text), options);
  } catch (error) {
    console.error('Error processing quokka:', error instanceof Error ? error.message : String(error));
    Deno.exit(1);
  }
}

// Define the main command
const command = new Command()
  .name('quokka-say')
  .version('0.2.0')
  .description('A modern implementation of cowsay but with a quokka character')
  .option(
    '-r, --rainbow [mode:string]',
    'Use rainbow colors (char, line, or no value for character mode)',
    { default: false },
  )
  .option(
    '-c, --color <color:string>',
    'Color of the output (red, green, yellow, blue, magenta, cyan, orange, indigo, violet)',
  )
  .arguments('[message:string]')
  .action(async (options: QuokkaOptions, message?: string) => {
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
  processQuokka,
};
