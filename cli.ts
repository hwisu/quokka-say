#!/usr/bin/env -S deno run --allow-read --allow-env --allow-run

import { runCli } from "./mod.ts";

if (import.meta.main) {
  runCli();
}
