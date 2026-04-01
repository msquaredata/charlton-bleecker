/**
 * Load .env.local / .env from the app root (lead-intake-form-cbg/), not process.cwd().
 * Fixes missing vars when `vercel dev` is started from a parent directory (monorepo root).
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const libDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(libDir, "..");

const envPath = join(projectRoot, ".env");
const localPath = join(projectRoot, ".env.local");
if (existsSync(envPath)) dotenv.config({ path: envPath });
if (existsSync(localPath)) dotenv.config({ path: localPath, override: true });
