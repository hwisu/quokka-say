# quokka-say

A modern implementation of cowsay but with a quokka character, built with Deno.

# Build for your platform
deno task build

# Or build for all platforms
deno task build:all
```

## Usage

```bash
# Basic usage with a message
./quokka-say "Hello from the quokka!"

# Pipe content from another command
ls -la | ./quokka-say

# Use colors
./quokka-say -c cyan "Hello in cyan!"
./quokka-say -c magenta "Hello in magenta!"

# Rainbow modes
./quokka-say -r "Character-based rainbow!"
./quokka-say -r line "Line-based rainbow!"

# Use fortune for random quotes (if installed)
./quokka-say
```

### Permissions Required

- `--allow-read`: Access to quokka.txt file
- `--allow-env`: Terminal size detection
- `--allow-run`: Fortune command execution (optional)

## License

MIT
