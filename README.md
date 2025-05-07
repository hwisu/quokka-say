# quokka-say

A modern implementation of cowsay but with a quokka character, built with Deno.

## 📥 Installation

### Global Installation

```bash
deno install -E --global -n quokka-say jsr:@hwisu/quokka-say/cli
export PATH="$HOME/.deno/bin:$PATH"
```

### Remove

```bash
rm $HOME/.deno/bin/quokka-say
deno cache --reload jsr:@hwisu/quokka-say/cli
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

## 🛠️ Development

```bash
# Run locally
deno task dev "Hello, Quokka!"

# Run tests
deno task test

# Build executable
deno task build

# Build for all platforms
deno task build:all
```

## 🔄 Releasing new versions

1. Bump the version using the version script:
   ```bash
   deno run --allow-read --allow-write scripts/bump-version.ts [major|minor|patch]
   ```

2. Follow the instructions shown after running the script.

3. The GitHub Actions workflow will automatically:
   - Create a new release with assets for all platforms
   - Publish the package to JSR

## 📄 License

MIT