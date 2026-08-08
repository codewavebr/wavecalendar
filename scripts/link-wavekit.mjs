import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const candidates = [
  process.env.WAVEKIT_ROOT,
  join(root, "wavekit"),
  join(root, "..", "wavekit"),
].filter(Boolean);

const wavekitRoot = candidates.find((candidate) =>
  existsSync(join(candidate, "package.json")),
);

if (!wavekitRoot) {
  console.error(
    "WaveKit checkout not found. Expected ./wavekit, ../wavekit, or WAVEKIT_ROOT.",
  );
  process.exit(1);
}

const wavekitDist = join(wavekitRoot, "dist");
const destination = join(root, "node_modules", "@codewavebr", "wavekit");

if (!existsSync(wavekitDist)) {
  console.error(
    `WaveKit dist/ not found at ${wavekitDist}. Run bun install && bun run build in WaveKit first.`,
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

console.log(`Linked ${wavekitRoot} dist into node_modules/@codewavebr/wavekit`);
