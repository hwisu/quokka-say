# quokka-say

A modern implementation of cowsay but with a quokka character, built with Deno.


## 📥 Installation

### Global Installation

```bash
# Install globally via JSR
deno install -A -n quokka-say jsr:@hwisu/quokka-say/cli
```

After installation, you can run the command directly from anywhere:

```bash
quokka-say "Hello, world!"
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

## 📄 License

MIT

