import { assertEquals, assertStringIncludes } from "@std/assert";
import { formatQuokka, quokka } from "./quokka.ts";

Deno.test("quokka variable should contain ASCII art", () => {
  // quokka 변수가 실제 ASCII 아트를 포함하는지 확인
  assertEquals(typeof quokka, "string");
  assertEquals(quokka.length > 0, true);
  assertStringIncludes(quokka, "█");
});

Deno.test("formatQuokka should handle empty message", () => {
  const result = formatQuokka("");

  // 빈 메시지를 처리할 수 있는지 확인
  assertEquals(typeof result, "string");
  assertEquals(result.length > 0, true);
  assertStringIncludes(result, "│");  // 말풍선 테두리 확인
});

Deno.test("formatQuokka should handle basic message", () => {
  const message = "Hello, world!";
  const result = formatQuokka(message);

  // 기본 메시지를 포함하는지 확인
  assertStringIncludes(result, message);
  assertStringIncludes(result, "│");  // 말풍선 테두리 확인
});

Deno.test("formatQuokka should handle multiline message", () => {
  const message = "Hello\nworld!";
  const result = formatQuokka(message);

  // 여러 줄 메시지를 처리할 수 있는지 확인
  assertStringIncludes(result, "Hello");
  assertStringIncludes(result, "world!");
});

Deno.test("formatQuokka should handle error gracefully", () => {
  // @ts-ignore: 고의적으로 오류 발생
  const result = formatQuokka({ invalidInput: true });

  // 오류가 발생해도 결과를 반환하는지 확인
  assertEquals(typeof result, "string");
  assertEquals(result.length > 0, true);
  assertStringIncludes(result, "Error");
});
