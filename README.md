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

# Use OpenAI API to generate a message
./quokka-say -a

# Get fortune quote and explain it in Korean with OpenAI
./quokka-say -fa
```

## OpenAI API Integration

To use the OpenAI API integration, you need to set your API key:

```bash
# Set your OpenAI API key
export OPENAI_API_KEY="your-api-key-here"
```

### OpenAI Options

- `-a, --ai`: Generate a random interesting fact or quote using OpenAI.
- `-fa, --fortune-ai`: Get a fortune quote and have OpenAI explain it in Korean for Korean users.

## Features

- Cute ASCII quokka character
- Supports pipe input (`command | quokka-say`)
- Rainbow color output (`-r` or `--rainbow`)
- Single color options (`-c` or `--color`)
- AI-generated content with OpenAI integration
- Korean explanation of fortune quotes
- Cross-platform binaries
