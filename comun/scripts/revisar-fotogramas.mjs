import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "fs";
const [,, comp, out, list] = process.argv;
const frames = JSON.parse(fs.readFileSync(list, "utf8"));
const serveUrl = await bundle({ entryPoint: process.cwd() + "/src/index.ts" });
const composition = await selectComposition({ serveUrl, id: comp });
for (const [src, f] of frames) {
  await renderStill({ serveUrl, composition, frame: f, output: `${out}/f${String(f).padStart(5, "0")}_${src}.jpg`, imageFormat: "jpeg", jpegQuality: 80, scale: 0.5 });
}
console.log("ok", frames.length);
