import { dirname, fromFileUrl, join } from '@std/path';

// 쿼카 ASCII 아트 파일 경로 조회 (상대 경로 처리)
const __dirname = dirname(fromFileUrl(import.meta.url));
const quokkaPath = join(__dirname, 'quokka.txt');

/**
 * 쿼카 ASCII 아트를 파일에서 읽어옴
 */
export const quokka = Deno.readTextFileSync(quokkaPath);

/**
 * CJK 문자인지 확인하는 함수
 * 한중일 문자는 보통 터미널에서 2칸을 차지함
 */
function isCJKChar(char: string): boolean {
  const code = char.charCodeAt(0);
  // CJK 통합 한자, 한글, 일본어 히라가나, 가타카나 등의 범위
  return (
    (code >= 0x4E00 && code <= 0x9FFF) || // CJK 통합 한자
    (code >= 0x3040 && code <= 0x30FF) || // 히라가나, 가타카나
    (code >= 0xAC00 && code <= 0xD7A3) || // 한글
    (code >= 0xFF00 && code <= 0xFFEF)    // 전각 문자
  );
}

/**
 * 문자열의 표시 너비를 계산하는 함수
 * CJK 문자를 2칸으로 계산
 */
function getStringWidth(str: string): number {
  let width = 0;
  for (const char of str) {
    width += isCJKChar(char) ? 2 : 1;
  }
  return width;
}

/**
 * 지정된 너비로 문자열을 자르는 함수
 * CJK 문자를 고려하여 실제 표시 너비에 맞게 자름
 */
function truncateToWidth(str: string, maxWidth: number): string {
  let width = 0;
  let result = '';

  for (const char of str) {
    const charWidth = isCJKChar(char) ? 2 : 1;
    if (width + charWidth <= maxWidth) {
      result += char;
      width += charWidth;
    } else {
      break;
    }
  }

  return result;
}

/**
 * 지정된 너비로 문자열을 패딩하는 함수
 * CJK 문자를 고려하여 실제 표시 너비에 맞게 패딩
 */
function padEndToWidth(str: string, width: number, padChar = ' '): string {
  const strWidth = getStringWidth(str);
  const padWidth = Math.max(0, width - strWidth);
  return str + padChar.repeat(padWidth);
}

/**
 * 텍스트를 정제하는 함수
 * 이상한 문자나 제어 문자를 제거하고 일반적인 텍스트로 변환
 */
function sanitizeText(text: string): string {
  // 일부 제어 문자와 포맷 문자 제거
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // 제어 문자 제거
    .replace(/\t/g, '    '); // 탭을 4개의 공백으로 변환
}

/**
 * Returns the quokka ASCII art with a speech bubble containing the given message
 * @param message - The message to display in the speech bubble
 * @returns The complete ASCII art with the speech bubble
 */
export function formatQuokka(message: string): string {
  try {
    // 텍스트 정제
    message = sanitizeText(message);

    const lines = formatMessage(message);

    // Count the number of lines in the quokka art
    const quokkaLines = quokka.split('\n');

    // Maximum available space for the speech bubble
    const maxBubbleHeight = 15; // Fixed max height to ensure good fit

    // If we have too many lines, we need to truncate the content
    let displayLines = lines;
    if (lines.length > maxBubbleHeight - 2) {
      // Show as many lines as we can fit
      displayLines = lines.slice(0, maxBubbleHeight - 2);
    }

    // Find the maximum displayed width of the lines
    const maxLength = Math.max(...displayLines.map((line) => getStringWidth(line) || 0), 10);

    // Set a reasonable width for the speech bubble
    const actualWidth = Math.min(maxLength, 60);

    // Create the box borders with consistent width
    const top = `┌${'─'.repeat(actualWidth + 2)}┐`;
    const bottom = `└${'─'.repeat(actualWidth + 2)}┘`;

    const formattedLines = displayLines.map((line) => {
      // CJK 문자를 고려하여 패딩 계산
      const visibleWidth = getStringWidth(line);
      const padding = ' '.repeat(Math.max(0, actualWidth - visibleWidth));
      return `│ ${line}${padding} │`;
    });

    // Create the speech bubble
    const bubbleLines = [
      top,
      ...formattedLines,
      bottom,
    ];

    const quokkaMaxWidth = Math.max(...quokkaLines.map(line => line.length || 0));

    const bubbleHeight = bubbleLines.length;

    const startLine = Math.max(5, Math.min(15, Math.floor(quokkaLines.length / 2) - Math.floor(bubbleHeight / 2)));

    const arrowLine = startLine + Math.floor(bubbleHeight / 2);

    const result = [];

    for (let i = 0; i < quokkaLines.length; i++) {
      const quokkaLine = quokkaLines[i] || '';

      if (i >= startLine && i < startLine + bubbleHeight) {
        const bubbleIndex = i - startLine;
        const bubbleLine = bubbleLines[bubbleIndex];

        if (i === arrowLine) {
          result.push(padEndToWidth(quokkaLine, quokkaMaxWidth + 2) + "==> " + bubbleLine);
        } else {
          result.push(padEndToWidth(quokkaLine, quokkaMaxWidth + 6) + bubbleLine);
        }
      } else {
        result.push(quokkaLine);
      }
    }

    return result.join('\n');
  } catch (error) {
    // Fallback to simple output in case of error
    return `${quokka}\n\nError processing message: ${message.substring(0, 50)}...`;
  }
}

/**
 * Format a message to fit within a specified line length
 * @param message - The message to format
 * @returns Array of formatted lines
 */
function formatMessage(message: string): string[] {
  if (!message) return [''];

  const maxLineLength = 40;
  try {
    // Split by explicit newlines first
    const paragraphs = message.split('\n');
    const lines: string[] = [];

    // Process each paragraph for word wrapping
    for (const paragraph of paragraphs) {
      if (paragraph.trim() === '') {
        // Preserve empty lines
        lines.push('');
        continue;
      }

      const words = paragraph.split(' ');
      let currentLine = '';
      let currentWidth = 0;

      for (const word of words) {
        // Skip processing of control characters or empty words
        if (!word) continue;

        const wordWidth = getStringWidth(word);

        // If the word itself is longer than max length, we need to break it
        if (wordWidth > maxLineLength) {
          // Push the current line if it's not empty
          if (currentLine) {
            lines.push(currentLine);
            currentLine = '';
            currentWidth = 0;
          }

          // Break the long word by characters considering CJK width
          let tempWord = '';
          let tempWidth = 0;

          for (const char of word) {
            const charWidth = isCJKChar(char) ? 2 : 1;
            if (tempWidth + charWidth <= maxLineLength) {
              tempWord += char;
              tempWidth += charWidth;
            } else {
              lines.push(tempWord);
              tempWord = char;
              tempWidth = charWidth;
            }
          }

          // 남은 부분 처리
          if (tempWord) {
            currentLine = tempWord;
            currentWidth = tempWidth;
          }
        }
        // Check if word fits on current line (including space)
        else if (currentWidth + wordWidth + (currentWidth > 0 ? 1 : 0) <= maxLineLength) {
          // Word fits on current line
          if (currentLine) {
            currentLine += ' ' + word;
            currentWidth += 1 + wordWidth; // 공백 1칸 + 단어 너비
          } else {
            currentLine = word;
            currentWidth = wordWidth;
          }
        } else {
          // Word doesn't fit, start a new line
          lines.push(currentLine);
          currentLine = word;
          currentWidth = wordWidth;
        }
      }

      // Add the last line of this paragraph
      if (currentLine) {
        lines.push(currentLine);
      }
    }

    return lines;
  } catch (error) {
    // Return a safe default if there's an error in text processing
    return ['[Text processing error]'];
  }
}
