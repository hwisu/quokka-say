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
};

/**
 * Available color names
 */
export type ColorName = keyof typeof colors;

/**
 * Rainbow colors in sequence (ROYGBIV)
 */
const rainbowColors: ColorName[] = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

/**
 * Apply color to text
 * @param text - Text to colorize
 * @param color - Color name
 * @returns Colorized text
 */
export function colorize(text: string, color: ColorName): string {
  if (color === 'reset' || !(color in colors)) {
    return text;
  }
  return `${colors[color]}${text}${colors.reset}`;
}

/**
 * Apply rainbow colors to text, with each character having a different color
 * @param text - Text to colorize
 * @returns Rainbow-colorized text
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
 * @returns Rainbow-colorized text by line
 */
export function rainbowizeByLine(text: string): string {
  const lines = text.split('\n');
  const totalLines = lines.length;
  const linesPerColor = Math.ceil(totalLines / rainbowColors.length);

  return lines
    .map((line, index) => {
      const colorIndex = Math.floor(index / linesPerColor);
      return colorize(line, rainbowColors[colorIndex]);
    })
    .join('\n');
}
