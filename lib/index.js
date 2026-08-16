import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { resolveDshHome } from "@deepseek-ai/dsh-home-paths";
import z from "zod";
import { createReadStream } from "node:fs";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * dsh-ui-kit — host half.
 *
 * The web API gateway only exposes an allowlisted set of settings namespaces
 * to browser configuration clients, so a third-party `ui-kit` namespace
 * can register (and shows in the in-process registry) but every browser
 * read/write is refused with `settings-not-exposed`. That is why preset +
 * background never survived a refresh.
 *
 * The sanctioned third-party persistence path in the current app is a Typert
 * remote service (same mechanism as dsh-skill-viewer and the plugin
 * inventory): the client mounts a contribution and calls `uiKit.getConfig`
 * / `setConfig` over the /api RPC; the host half persists the config as a
 * JSON file under `<DSH_HOME>/plugins/dsh-ui-kit/config.json`.
 */

const SERVICE = "uiKit";
const NS = "uiKit";

/** Wire schema: the shape the browser stores and the file on disk carries. */
const configSchema = z.object({
  preset: z.string(),
  background: z.object({
    image: z.string(),
    preview: z.string(),
    glass: z.number(),
    position: z.string(),
    size: z.string(),
    // 纸纹纹理 + 强度 + 颜色 + 高级手动分区透明度（新增字段，可选以兼容旧配置文件）
    texture: z.string().optional(),
    textureStrength: z.number().optional(),
    textureColor: z.string().optional(),
    manual: z.boolean().optional(),
    opacity: z.object({
      main: z.number(),
      sidebar: z.number(),
      card: z.number(),
      input: z.number(),
      dialog: z.number(),
    }).optional(),
    textDepth: z.object({
      main: z.number(),
      sidebar: z.number(),
      card: z.number(),
      input: z.number(),
      dialog: z.number(),
    }).optional(),
  }),
});

const setConfigResultSchema = z.object({ ok: z.boolean() });

/** Typed wire descriptors registered with the API gateway. */
const MANIFEST = {
  package: "dsh-ui-kit",
  face: "host",
  schemas: [],
  invocations: [
    {
      id: "dsh-ui-kit#uiKit/getConfig",
      service: SERVICE,
      namespace: NS,
      method: "getConfig",
      invocation: { kind: "direct" },
      parameters: [],
      result: { mode: "strict", typeSymbol: "dsh-ui-kit#Config", schema: configSchema.nullable() },
    },
    {
      id: "dsh-ui-kit#uiKit/setConfig",
      service: SERVICE,
      namespace: NS,
      method: "setConfig",
      invocation: { kind: "direct" },
      parameters: [
        { name: "config", wire: "config", source: "json", codec: { mode: "strict", typeSymbol: "dsh-ui-kit#Config", schema: configSchema } },
      ],
      result: { mode: "strict", typeSymbol: "dsh-ui-kit#SetConfigResult", schema: setConfigResultSchema },
    },
    {
      id: "dsh-ui-kit#uiKit/clearConfig",
      service: SERVICE,
      namespace: NS,
      method: "clearConfig",
      invocation: { kind: "direct" },
      parameters: [],
      result: { mode: "strict", typeSymbol: "dsh-ui-kit#SetConfigResult", schema: setConfigResultSchema },
    },
  ],
  model: { services: [], events: [], objects: [] },
};

export const name = "ui-kit";
export const inject = ["typert", "webServer"];

/** Resolve the durable config file: <DSH_HOME>/plugins/dsh-ui-kit/config.json */
function configPath() {
  return join(resolveDshHome(), "plugins", "dsh-ui-kit", "config.json");
}

/**
 * The remote service instance. Constructing it registers the "uiKit"
 * cordis service; the manifest above lets the API gateway dispatch the
 * `uiKit/*` endpoints from any browser.
 */
class UiKitGateway extends TypertRemoteService {
  constructor(ctx) {
    super(ctx, SERVICE);
  }

  /** Read the persisted config; `null` when nothing was saved yet. */
  async getConfig() {
    let text;
    try {
      text = await readFile(configPath(), "utf8");
    } catch (error) {
      if (error?.code === "ENOENT") return null;
      throw error;
    }
    try {
      return configSchema.parse(JSON.parse(text));
    } catch {
      return null;
    }
  }

  /** Validate and atomically persist the config. */
  async setConfig(config) {
    const parsed = configSchema.parse(config);
    const file = configPath();
    await mkdir(dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(parsed), "utf8");
    await rename(tmp, file);
    return { ok: true };
  }

  /** Drop the persisted config (fall back to defaults). */
  async clearConfig() {
    try {
      await rm(configPath(), { force: true });
    } catch {
      // 文件被占用等情况下由 getConfig 的解析兜底
    }
    return { ok: true };
  }
}

export function apply(ctx) {
  new UiKitGateway(ctx);
  ctx.effect(() => ctx.typert.register(MANIFEST), "ui-kit: typert manifest");
  registerWallpaperRoutes(ctx);
}

// ── 壁纸文件路由：/dsh-ui-kit-wallpapers/<category>/<file> ──
// 「使用预设」壁纸（mp4 动态 / jpg-png 静态）体积大，不塞进 client bundle，
// 由宿主直接从 wallpapers/ 目录流式提供；支持 Range（206）供视频拖动进度。
const WALLPAPERS_DIR = fileURLToPath(new URL("../wallpapers/", import.meta.url));
const CONTENT_TYPES = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function registerWallpaperRoutes(ctx) {
  const webServer = ctx.get("webServer");
  if (webServer === undefined) return;

  const handler = async (req, res) => {
    try {
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405);
        res.end();
        return;
      }
      // prefix 路由下 req.url 是全路径；剥掉前缀得相对文件路径，防目录穿越
      let rel;
      try {
        const pathname = decodeURIComponent((req.url || "").split("?")[0]);
        if (!pathname.startsWith("/dsh-ui-kit-wallpapers/")) throw new Error("bad prefix");
        rel = pathname.slice("/dsh-ui-kit-wallpapers/".length);
      } catch {
        res.writeHead(400);
        res.end();
        return;
      }
      const target = join(WALLPAPERS_DIR, rel);
      if (target !== WALLPAPERS_DIR && !target.startsWith(WALLPAPERS_DIR.endsWith("\\") ? WALLPAPERS_DIR : WALLPAPERS_DIR + "\\") && !target.startsWith(WALLPAPERS_DIR + "/")) {
        res.writeHead(403);
        res.end();
        return;
      }
      const info = await stat(target);
      if (!info.isFile()) {
        res.writeHead(404);
        res.end();
        return;
      }
      const type = CONTENT_TYPES[extname(target).toLowerCase()] || "application/octet-stream";
      const range = req.headers && req.headers.range;
      // 缩略图内容稳定、可长期缓存；原图缓存一天，刷新不再重复下载几十 MB 的壁纸。
      const isThumb = rel.startsWith("thumbs/");
      const headers = {
        "Content-Type": type,
        "Accept-Ranges": "bytes",
        "Cache-Control": isThumb ? "public, max-age=31536000, immutable" : "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      };
      let start = 0;
      let end = info.size - 1;
      let status = 200;
      if (typeof range === "string") {
        const m = range.match(/bytes=(\d*)-(\d*)/);
        if (m) {
          if (m[1] !== "") start = parseInt(m[1], 10);
          if (m[2] !== "") end = parseInt(m[2], 10);
          if (Number.isFinite(start) && Number.isFinite(end) && start <= end && start < info.size) {
            end = Math.min(end, info.size - 1);
            status = 206;
            headers["Content-Range"] = "bytes " + start + "-" + end + "/" + info.size;
          }
        }
      }
      headers["Content-Length"] = String(end - start + 1);
      res.writeHead(status, headers);
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      const stream = createReadStream(target, { start, end });
      stream.on("error", () => {
        try { res.destroy(); } catch { /* 忽略 */ }
      });
      stream.pipe(res);
    } catch (error) {
      const code = error && error.code === "ENOENT" ? 404 : 500;
      try {
        if (!res.headersSent) res.writeHead(code);
        res.end();
      } catch { /* 响应已开始则忽略 */ }
    }
  };

  ctx.effect(() => webServer.register({
    kind: "prefix",
    path: "/dsh-ui-kit-wallpapers",
    handler,
  }), "ui-kit: wallpaper file route");
}

export const UI_KIT_NAMESPACE = NS;
