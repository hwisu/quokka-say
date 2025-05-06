import { assertEquals } from "@std/assert";
import { colorize, rainbowize, rainbowizeByLine, ColorName } from "./colors.ts";

Deno.test("colorize should add color codes to text", () => {
  const text = "Hello";
  const color = "red" as ColorName;
  const colorized = colorize(text, color);

  // 컬러 코드가 추가되었는지 확인
  assertEquals(colorized.includes(text), true);
  assertEquals(colorized.length > text.length, true);
});

Deno.test("colorize should return original text for invalid color", () => {
  const text = "Hello";
  // @ts-ignore - 테스트용 invalid color
  const colorized = colorize(text, "invalid-color");
  assertEquals(colorized, text);
});

Deno.test("rainbowize should color each character", () => {
  const text = "Hello";
  const rainbowed = rainbowize(text);

  // 길이가 원본보다 길어졌는지 확인
  assertEquals(rainbowed.length > text.length, true);
});

Deno.test("rainbowizeByLine should handle multi-line text", () => {
  const text = "Hello\nWorld";
  const rainbowed = rainbowizeByLine(text);

  // 줄바꿈이 유지되는지 확인
  assertEquals(rainbowed.split("\n").length, 2);
  // 길이가 원본보다 길어졌는지 확인
  assertEquals(rainbowed.length > text.length, true);
});
