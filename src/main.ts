import { Command } from '@cliffy/command';
import { formatQuokka } from './quokka.ts';
import { colorize, ColorName, rainbowize, rainbowizeByLine } from './colors.ts';

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

  while (true) {
    const readResult = await Deno.stdin.read(buffer);
    if (readResult === null) break;

    text += decoder.decode(buffer.subarray(0, readResult));

    // If we didn't fill the buffer, we're done
    if (readResult < buffer.length) break;
  }

  return text.trim();
}

/**
 * Check if fortune program is available and if so, get a fortune quote.
 * If fortune is not available, try to get a response from OpenAI API.
 * @returns Promise with the fortune or AI text, or empty string if both are not available
 */
async function tryGetFortune(): Promise<string> {
  try {
    // First try to run the fortune command
    const command = new Deno.Command('fortune', {
      args: ['-s'],  // -s for short fortunes
      stdout: 'piped',
      stderr: 'piped',
    });

    const { success, stdout } = await command.output();

    if (success) {
      const output = new TextDecoder().decode(stdout).trim();
      return output;
    }
    return '';
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    return '';
  }
}

// Define the main command
const command = new Command()
  .name('quokka-say')
  .version('0.1.0')
  .description('A modern implementation of cowsay but with a quokka character')
  .option(
    '-r, --rainbow [mode:string]',
    'Use rainbow colors (char, line, or no value for character mode)',
    { default: false },
  )
  .option(
    '-c, --color <color:string>',
    'Color of the output (red, green, yellow, blue, magenta, cyan)',
  )
  .arguments('[message:string]')
  .action(async (options, message) => {
    try {
      // 메시지 우선순위: 명령행 인자 > 표준 입력 > fortune 명령어 > 기본 메시지
      const textMessage = message
        || await readFromStdin()
        || await tryGetFortune()
        || "Hello, I'm a quokka!";

      const quokkaText = formatQuokka(textMessage);

      const coloredText = options.rainbow
        ? options.rainbow === 'line'
          ? rainbowizeByLine(quokkaText)
          : rainbowize(quokkaText)
        : options.color
          ? colorize(quokkaText, options.color as ColorName)
          : quokkaText;

      console.log(coloredText);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      Deno.exit(1);
    }
  });

try {
  await command.parse(Deno.args);
} catch (error) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  Deno.exit(1);
}
