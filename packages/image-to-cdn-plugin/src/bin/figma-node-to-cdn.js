#!/usr/bin/env node
import { parseArgs } from "node:util";

import { requestFigmaImages, requestUploadAsset } from "../lib/api.js";

function printHelp() {
  console.log(`
用法：node figma-node-to-cdn.js --file-key <key> --node-ids <ids> [选项]

参数：
  --file-key <key>    Figma 文件 key
  --node-ids <ids>    逗号分隔的节点 id（如 6705-22289,6705-22290）

可选：
  --scale <n>         缩放倍数，0.01~4，默认 4
  --format <fmt>      png | jpg | svg | pdf，默认 png
  --width <n>         上传时的宽度，默认 0
  --height <n>        上传时的高度，默认 0
  --compress          是否压缩，默认 false

环境变量：
  FIGMA_API_KEY       Figma Personal Access Token
`);
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      "file-key": { type: "string" },
      "node-ids": { type: "string" },
      scale: { type: "string", default: "4" },
      format: { type: "string", default: "png" },
      width: { type: "string", default: "0" },
      height: { type: "string", default: "0" },
      compress: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false }
    }
  });

  if (values.help) {
    printHelp();
    return;
  }

  if (!values["file-key"] || !values["node-ids"]) {
    console.error("缺少参数：--file-key 和 --node-ids");
    printHelp();
    process.exitCode = 1;
    return;
  }

  const figmaApiKey = process.env.FIGMA_API_KEY;
  if (!figmaApiKey) {
    console.error("请先设置环境变量 FIGMA_API_KEY");
    process.exitCode = 1;
    return;
  }

  const fileKey = values["file-key"];
  const nodeIds = values["node-ids"]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const scale = Number(values.scale);
  const format = values.format;
  const width = Number(values.width);
  const height = Number(values.height);
  const isCompressed = values.compress;

  try {
    const images = await requestFigmaImages({ fileKey, nodeIds, scale, format, figmaApiKey });
    const result = await Promise.all(
      images.map(async (image) => {
        try {
          const url = await requestUploadAsset({ src: image.url, isCompressed, width, height });
          return { key: image.key, url };
        } catch (err) {
          return { key: image.key, url: "", error: err instanceof Error ? err.message : String(err) };
        }
      })
    );
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("执行失败：", err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}

main();
