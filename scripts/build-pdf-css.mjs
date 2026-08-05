import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

const projectRoot = resolve(currentDirectory, "..");

const inputPath = resolve(projectRoot, "app/lib/pdf/pdf-tailwind-input.css");

const temporaryOutputPath = resolve(
  projectRoot,
  "app/lib/pdf/.pdf-tailwind-output.css",
);

const typescriptOutputPath = resolve(
  projectRoot,
  "app/lib/pdf/generated-pdf-tailwind.ts",
);

mkdirSync(dirname(temporaryOutputPath), {
  recursive: true,
});

const pnpmExecutable = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

try {
  execFileSync(
    pnpmExecutable,
    [
      "exec",
      "tailwindcss",
      "-i",
      inputPath,
      "-o",
      temporaryOutputPath,
      "--minify",
    ],
    {
      cwd: projectRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );

  const compiledCss = readFileSync(temporaryOutputPath, "utf8");

  const generatedModule = `
// Ce fichier est généré automatiquement.
// Ne pas le modifier manuellement.

export const PDF_TAILWIND_CSS = ${JSON.stringify(compiledCss)};
`;

  writeFileSync(typescriptOutputPath, generatedModule, "utf8");

  console.log(`CSS Tailwind PDF généré : ${typescriptOutputPath}`);
} finally {
  rmSync(temporaryOutputPath, {
    force: true,
  });
}
