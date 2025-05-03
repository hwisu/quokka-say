# quokka-say

A modern implementation of cowsay but with a quokka character, built with Deno.

## Installation

```bash
# Build for your platform
deno task build

# Or build for all platforms
deno task build:all
```

## Usage

```bash
# Direct usage
./quokka-say "Hello from the quokka!"

# Pipe usage
echo "Hello from the quokka!" | ./quokka-say

# Other commands with pipe
ls -la | ./quokka-say

# Rainbow colors
./quokka-say -r "Hello from the quokka!"
echo "Rainbow quokka!" | ./quokka-say -r

# Rainbow line mode
./quokka-say -r line "Hello from the quokka!"

# Specific color
./quokka-say -c cyan "Hello from the quokka!"
```

## Features

- Cute ASCII quokka character
- Supports pipe input (`command | quokka-say`)
- Rainbow color output (`-r` or `--rainbow`)
- Single color options (`-c` or `--color`)
- Cross-platform binaries
