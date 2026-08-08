import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const wavekitRoot = join(root, "..", "wavekit");
const wavekitDist = join(wavekitRoot, "dist");
const destination = join(root, "node_modules", "@codewave", "wavekit");

if (!existsSync(wavekitDist)) {
  console.error(
    "WaveKit dist/ not found. Run `bun install && bun run build` in ../wavekit first.",
  );
  process.exit(1);
}

mkdirSync(dirname(destination), { recursive: true });
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });

cpSync(join(wavekitRoot, "package.json"), join(destination, "package.json"));
cpSync(wavekitDist, join(destination, "dist"), { recursive: true });

if (existsSync(join(wavekitRoot, "tailwind-preset.cjs"))) {
  cpSync(
    join(wavekitRoot, "tailwind-preset.cjs"),
    join(destination, "tailwind-preset.cjs"),
  );
}

console.log("Linked local WaveKit dist into node_modules/@codewave/wavekit");
