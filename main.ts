// Leonida Legend — the entry program for gta6-trophy-guide-01.
//
// Copies app/ (the guide and tracker) and screenshots/ (four renders of the
// running app) from beside this file into the output directory, then writes
// /output/dossier.json with the kit's dossier library. Node 22, stdlib only.
//
// The grader runs this in a container where /output is a volume mount point,
// so the output directory itself is never removed — only its contents are
// cleared first. Removing the directory fails on the bind mount (EBUSY).

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Where the built entry goes. The harness sets MAKEFUN_OUTPUT_DIR; the
// grader's default is /output.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the dossier bytes. The rest refuse an entry the scorer would refuse —
// more than 4 screenshots, one over 256 KiB, more than 993 files and
// directories in app/, or more than 48 MiB of app files.
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
} as const;

// The directory this file lives in (the repository root).
const repoRoot = fileURLToPath(new URL('.', import.meta.url));

// Empty a directory's contents without removing the directory itself.
// mkdirSync first so the call is safe even when the directory is missing.
function clearContents(dir: string): void {
  mkdirSync(dir, { recursive: true });
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

// Copy one of the entry's source folders into the output directory.
function copyFolder(name: string): void {
  const from = join(repoRoot, name);
  if (!existsSync(from)) throw new Error(`missing ${name}/ beside main.ts`);
  cpSync(from, join(outDir, name), { recursive: true });
}

clearContents(outDir);
copyFolder('app');
copyFolder('screenshots');

const dossier = buildDossier(outDir, DOSSIER_CAPS);
writeFileSync(join(outDir, 'dossier.json'), dossier);

const shots = readdirSync(join(outDir, 'screenshots')).length;
console.log(`Leonida Legend: app/ + ${shots} screenshots copied to ${outDir}, dossier.json ${dossier.length} bytes.`);
