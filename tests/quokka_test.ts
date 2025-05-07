import { assertEquals } from '@std/assert';
import { formatQuokka } from '../src/quokka.ts';
import { colorize, rainbowize } from '../src/main.ts';

Deno.test('formatQuokka - formats text correctly', () => {
  const result = formatQuokka('Hello, world!');

  // Check if the result contains the message and quokka
  assertTrue(result.includes('Hello, world!'));
  assertTrue(result.includes('█████████'));
});

Deno.test('formatQuokka - handles empty input', () => {
  const result = formatQuokka('');
  assertTrue(result.length > 0); // Should still return the quokka
});

Deno.test('formatQuokka - handles null input', () => {
  // @ts-expect-error: Testing with null input
  const result = formatQuokka(null);
  assertTrue(result.length > 0); // Should handle gracefully
});

Deno.test('colorize - applies colors correctly', () => {
  const coloredText = colorize('Hello', 'red');
  assertTrue(coloredText.includes('\x1b[31m')); // Red color code
  assertTrue(coloredText.includes('\x1b[0m')); // Reset code
  assertTrue(coloredText.includes('Hello'));
});

Deno.test('rainbowize - applies rainbow colors to text', () => {
  const rainbowText = rainbowize('ABC');

  // Should have color codes for each character
  assertTrue(rainbowText.includes('\x1b[31m')); // Red
  assertTrue(rainbowText.includes('\x1b[0m')); // Reset
  assertTrue(rainbowText.includes('A'));
  assertTrue(rainbowText.includes('B'));
  assertTrue(rainbowText.includes('C'));
});

// Helper function for tests
function assertTrue(condition: boolean): void {
  assertEquals(condition, true);
}
