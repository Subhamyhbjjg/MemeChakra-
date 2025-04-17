import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { type ViteDevServer } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";

export async function setupVite(app: express.Express): Promise<ViteDevServer> {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    base: '/'
  });

  app.use(vite.middlewares);
  
  return vite;
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: express.Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
