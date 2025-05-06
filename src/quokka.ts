export const quokka: string = `
        █████████                      ██████           
      ██        ███                  ███    ██          
     ██ █████     ████            ███     ███ ██        
    ██    █████   █████████  ████████    ████  ██       
    █       ████ ██      ██████     ███ ████    █       
    █       █████                      ████     █       
    █      ███                           ███    █       
    █     ███                             ███   █       
     █   ███      ████               ███   ███ ██       
     ██████     ███ ████            ██ ███  █████       
      ████      ████████    █████   ██████   ███        
      ███        ██████    ████████  █████    ███       
      ██                 ████ ██████           ███      
   ████                  ███████████             ███    
  ███                    ███████████              ███   
  ██              ██       █████████    ██          ██  
 ██             ██████      █████    █████          ███ 
 █                  ██████  █████ ██████             ██ 
██                      ████████████                 ███
█                                                    ███
█                                                    ███
 █                                                   ██ 
 ██                                                  ██ 
  ██                                                ██  
  ███                                             ████  
   ███                                          ████    
   ██████                                    █████      
   ██  ██████                          ████████ ██      
  ██       ██████████████████████████████████   ███     
`

/**
 * Check if a character is a CJK character (Chinese, Japanese, Korean characters usually take 2 spaces in terminal)
 */
function isCJKChar(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    (code >= 0x4E00 && code <= 0x9FFF) || // CJK Unified Ideographs
    (code >= 0x3040 && code <= 0x30FF) || // Hiragana, Katakana
    (code >= 0xAC00 && code <= 0xD7A3) || // Hangul
    (code >= 0xFF00 && code <= 0xFFEF) // Fullwidth characters
  );
}

/**
 * Calculate the display width of a string (counting CJK characters as 2 spaces)
 */
function getStringWidth(str: string): number {
  return [...str].reduce((width, char) => width + (isCJKChar(char) ? 2 : 1), 0);
}

/**
 * Pad a string to the specified width (considering CJK characters)
 */
function padEndToWidth(str: string, width: number, padChar = ' '): string {
  const strWidth = getStringWidth(str);
  const padWidth = Math.max(0, width - strWidth);
  return str + padChar.repeat(padWidth);
}

/**
 * Sanitize text (remove control characters)
 */
function sanitizeText(text: string): string {
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .replace(/\t/g, '    '); // Convert tabs to 4 spaces
}

/**
 * Get the terminal width
 */
function getTerminalWidth(): number {
  try {
    const { columns } = Deno.consoleSize();
    return columns;
  } catch {
    return 80; // Default value
  }
}

interface SplitWordResult {
  lines: string[];
  remainingLine: string;
  remainingWidth: number;
}

/**
 * Split a long word to fit within the maximum line length
 */
function splitLongWord(
  word: string,
  maxLength: number,
  indent = 0,
): SplitWordResult {
  const lines: string[] = [];
  let tempWord = '';
  let tempWidth = 0;
  const indentStr = ' '.repeat(indent);

  for (const char of word) {
    const charWidth = isCJKChar(char) ? 2 : 1;
    if (tempWidth + charWidth <= maxLength - indent) {
      tempWord += char;
      tempWidth += charWidth;
    } else {
      lines.push(indentStr + tempWord);
      tempWord = char;
      tempWidth = charWidth;
    }
  }

  return {
    lines,
    remainingLine: tempWord ? indentStr + tempWord : '',
    remainingWidth: tempWidth,
  };
}

/**
 * Process a paragraph (either numbered or regular)
 */
function processParagraph(
  paragraph: string,
  maxLineLength: number,
  isNumbered = false
): string[] {
  // For empty paragraphs
  if (!paragraph.trim()) return [''];

  // Special handling for Korean text with numbered points
  if (isNumbered && paragraph.includes('한글')) {
    return [paragraph];
  }

  // Extract number part for numbered paragraphs
  const numberMatch = isNumbered ? paragraph.match(/^(\d+\.)/) : null;
  const numberPart = numberMatch ? numberMatch[1] : '';
  const content = isNumbered
    ? paragraph.slice(numberPart.length).trim()
    : paragraph;

  // Split into words
  const words = content.split(' ').filter(Boolean);
  const lines: string[] = [];

  // Initial line setup
  let currentLine = isNumbered ? numberPart + ' ' : '';
  let currentWidth = getStringWidth(currentLine);

  // Process each word
  for (const word of words) {
    const wordWidth = getStringWidth(word);

    // Split long words
    if (wordWidth > maxLineLength) {
      // Add the current non-empty line
      if (currentLine && (!isNumbered || currentLine !== numberPart + ' ')) {
        lines.push(currentLine);
      }

      // Split the word
      const indent = isNumbered ? 2 : 0;
      const { lines: wordLines, remainingLine, remainingWidth } = splitLongWord(
        word,
        maxLineLength,
        indent,
      );
      lines.push(...wordLines);

      currentLine = remainingLine;
      currentWidth = remainingWidth;
    }
    // Check if it fits on the current line
    else if (currentWidth + wordWidth + (currentWidth > 0 ? 1 : 0) <= maxLineLength) {
      if (currentLine && (!isNumbered || currentLine !== numberPart + ' ')) {
        currentLine += ' ' + word;
        currentWidth += 1 + wordWidth;
      } else {
        currentLine += word;
        currentWidth += wordWidth;
      }
    }
    // Start a new line
    else {
      lines.push(currentLine);
      currentLine = (isNumbered ? '  ' : '') + word;
      currentWidth = (isNumbered ? 2 : 0) + wordWidth;
    }
  }

  // Add the last line
  if (currentLine) {
    lines.push(currentLine);
  }

  // Add an empty line after numbered paragraphs for readability
  if (isNumbered && lines.length > 0 && lines[lines.length - 1].trim()) {
    lines.push('');
  }

  return lines;
}

/**
 * Format a message to fit within a specified width
 */
function formatMessage(message: string): string[] {
  if (!message) return [''];

  const maxLineLength = 40;
  try {
    // Split by newlines and process each paragraph
    return message.split('\n').flatMap((paragraph) => {
      const isNumbered = /^\d+\./.test(paragraph.trim());
      return processParagraph(paragraph, maxLineLength, isNumbered);
    });
  } catch (error) {
    console.error('Text processing error:', error);
    return ['[Text processing error]'];
  }
}

/**
 * Create a speech bubble for the message
 */
function createSpeechBubble(lines: string[]): string[] {
  // Calculate maximum width
  const maxLength = Math.max(...lines.map((line) => getStringWidth(line) || 0), 10);
  const actualWidth = Math.min(maxLength, 60);

  // Create borders
  const top = `┌${'─'.repeat(actualWidth + 2)}┐`;
  const bottom = `└${'─'.repeat(actualWidth + 2)}┘`;

  // Add padding to content lines
  const formattedLines = lines.map((line) => {
    const visibleWidth = getStringWidth(line);
    const padding = ' '.repeat(Math.max(0, actualWidth - visibleWidth));
    return `│ ${line}${padding} │`;
  });

  return [top, ...formattedLines, bottom];
}

/**
 * Format layout based on terminal width
 */
function formatLayout(
  quokkaLines: string[],
  bubbleLines: string[],
  terminalWidth: number,
): string[] {
  // Calculate required widths
  const quokkaMaxWidth = Math.max(...quokkaLines.map((line) => line.length || 0));
  const minWidthForHorizontal = quokkaMaxWidth + bubbleLines[0].length + 10;

  // Choose horizontal or vertical layout based on terminal width
  return terminalWidth >= minWidthForHorizontal
    ? formatHorizontalLayout(quokkaLines, bubbleLines, quokkaMaxWidth)
    : [
        ...quokkaLines,
        '  ||  ',
        '  \\/  ',
        ...bubbleLines,
      ];
}

/**
 * Format horizontal layout (quokka side-by-side with speech bubble)
 */
function formatHorizontalLayout(
  quokkaLines: string[],
  bubbleLines: string[],
  quokkaMaxWidth: number,
): string[] {
  const bubbleHeight = bubbleLines.length;
  const startLine = Math.max(
    5,
    Math.min(15, Math.floor(quokkaLines.length / 2) - Math.floor(bubbleHeight / 2)),
  );
  const arrowLine = startLine + Math.floor(bubbleHeight / 2);

  return quokkaLines.map((quokkaLine, i) => {
    quokkaLine = quokkaLine || '';

    if (i >= startLine && i < startLine + bubbleHeight) {
      const bubbleIndex = i - startLine;
      const bubbleLine = bubbleLines[bubbleIndex];

      return i === arrowLine
        ? padEndToWidth(quokkaLine, quokkaMaxWidth + 2) + '==> ' + bubbleLine
        : padEndToWidth(quokkaLine, quokkaMaxWidth + 6) + bubbleLine;
    }

    return quokkaLine;
  });
}

/**
 * Format quokka ASCII art with a speech bubble containing the given message
 */
export function formatQuokka(message: string): string {
  try {
    // Process the message and create speech bubble
    const sanitizedMessage = sanitizeText(message);
    const messageLines = formatMessage(sanitizedMessage);
    const quokkaLines = quokka.split('\n');

    // Truncate if too many lines
    const maxBubbleHeight = 15;
    const displayLines = messageLines.length > maxBubbleHeight - 2
      ? messageLines.slice(0, maxBubbleHeight - 2)
      : messageLines;

    // Create the bubble and format layout
    const bubbleLines = createSpeechBubble(displayLines);
    const resultLines = formatLayout(quokkaLines, bubbleLines, getTerminalWidth());

    return resultLines.join('\n');
  } catch (error: any) {
    // Fallback output in case of error
    const errorMessage = error?.message || 'Unknown error';
    return `${quokka}\n\nError processing message: ${errorMessage.substring(0, 50)}...`;
  }
}
