import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type ViteDevServer, type Plugin } from "vite";

const PROJECT_ROOT = import.meta.dirname;
const LOG_DIR = path.join(PROJECT_ROOT, ".logs");
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

function trimLogFile(logPath: string, maxSize: number) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) return;
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines: string[] = [];
    let keptBytes = 0;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}\n`, "utf-8");
      if (keptBytes + lineBytes > TRIM_TARGET_BYTES) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch { /* ignore */ }
}

function vitePluginDevLogger(): Plugin {
  return {
    name: "dev-logger",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/__dev__/logs", (req, res, next) => {
        if (req.method !== "POST") return next();
        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            if (payload.consoleLogs?.length > 0) {
              ensureLogDir();
              const logPath = path.join(LOG_DIR, "console.log");
              const lines = payload.consoleLogs.map((e: unknown) => `[${new Date().toISOString()}] ${JSON.stringify(e)}`);
              fs.appendFileSync(logPath, `${lines.join("\n")}\n`);
              trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
            }
          } catch { /* ignore */ }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), vitePluginDevLogger()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".railway.app",
      ".up.railway.app",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
