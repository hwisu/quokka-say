# quokka-say

A modern implementation of cowsay but with a quokka character, built with Deno.

[![JSR Score](https://jsr.io/badges/@hwisu/quokka-say/score)](https://jsr.io/@hwisu/quokka-say/score)
[![JSR Version](https://jsr.io/badges/@hwisu/quokka-say/version)](https://jsr.io/@hwisu/quokka-say)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

Quokka-say is a fun command-line tool that displays messages in a speech bubble next to a cute
quokka ASCII art. It's inspired by the classic "cowsay" program but features a friendly quokka
character instead.

## 📋 Features

- **Responsive Layout**: Automatically adapts to terminal width
- **Unicode Support**: Properly handles CJK characters (Chinese, Japanese, Korean)
- **Color Options**: Supports single colors or rainbow mode (character or line-based)
- **Multiple Input Methods**: Command arguments, piped input, or fortune integration
- **Error Resilience**: Graceful error handling with fallbacks
- **Cross-platform**: Works on macOS, Linux, and Windows

## 📥 Installation

### Global Installation (Recommended)

```bash
# Install globally via JSR
deno install -A -n quokka-say jsr:@hwisu/quokka-say/cli
```

After installation, you can run the command directly from anywhere:

```bash
quokka-say "Hello, world!"
```

### Module Usage

```bash
# Add to your project via JSR
deno add @hwisu/quokka-say
```

### Manual Install (Build from Source)

```bash
# Clone the repository
git clone https://github.com/hwisu/quokka-say.git
cd quokka-say

# Build for your platform
deno task build
```

## 🚀 Usage

### As CLI

```bash
# Basic usage with a message
quokka-say "Hello from the quokka!"

# Pipe content from another command
ls -la | quokka-say

# Use colors
quokka-say -c cyan "Hello in cyan!"
quokka-say -c magenta "Hello in magenta!"

# Rainbow modes
quokka-say -r "Character-based rainbow!"
quokka-say -r line "Line-based rainbow!"

# Use fortune for random quotes (if installed)
quokka-say
```

### Import in Your Code

```typescript
// Import the module
import { formatQuokka } from "@hwisu/quokka-say/src/quokka.ts";
import { colorize } from "@hwisu/quokka-say/src/colors.ts";

// Use in your code
console.log(formatQuokka("Hello from the quokka!"));

// With colors
console.log(colorize(formatQuokka("Hello in blue!"), "blue"));
```

## 🎨 Available Colors

- red
- orange
- yellow
- green
- blue
- indigo
- violet
- cyan
- magenta
- white
- black

## 🔧 Configuration

### CLI Options

| Option | Description |
|--------|-------------|
| `-r, --rainbow [mode]` | Use rainbow colors (char, line, or no value for character mode) |
| `-c, --color <color>` | Color of the output (see Available Colors) |

### Permissions Required

- `--allow-read`: Access to quokka.txt file
- `--allow-env`: Terminal size detection
- `--allow-run`: Fortune command execution (optional)

## 🧩 API Reference

### `formatQuokka(message: string): string`

Format a message with the quokka ASCII art.

```typescript
import { formatQuokka } from "@hwisu/quokka-say/src/quokka.ts";

// Creates a formatted message with quokka ASCII art
const quokkaMessage = formatQuokka("Hello world!");
console.log(quokkaMessage);
```

### `colorize(text: string, color: ColorName): string`

Apply color to text.

```typescript
import { colorize } from "@hwisu/quokka-say/src/colors.ts";

// Colorize text with available colors
const coloredText = colorize("Hello", "green");
console.log(coloredText);
```

### `rainbowize(text: string): string`

Apply rainbow colors to text, with each character having a different color.

```typescript
import { rainbowize } from "@hwisu/quokka-say/src/colors.ts";

// Rainbow colorize text character by character
const rainbowText = rainbowize("Hello Rainbow!");
console.log(rainbowText);
```

### `rainbowizeByLine(text: string): string`

Apply rainbow colors to text, with each line having a different color.

```typescript
import { rainbowizeByLine } from "@hwisu/quokka-say/src/colors.ts";

// Rainbow colorize text line by line
const rainbowLineText = rainbowizeByLine("Hello\nRainbow\nWorld!");
console.log(rainbowLineText);
```

## 📄 License

MIT © [hwisu](https://github.com/hwisu)

