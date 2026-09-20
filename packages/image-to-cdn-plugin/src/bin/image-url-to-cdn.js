#!/usr/bin/env node
import { parseArgs } from "node:util";

import { requestUploadAsset } from "../lib/api.js";

function printHelp() {
  console.log(`
用法：node image-url-to-cdn.js --image-url <url> [选项]

参数：
  --image-url <url>   图片地址（多个用逗号分隔）

可选：
  --width <n>         上传时的宽度，默认 0
  --height <n>        上传时的高度，默认 0
  --compress          是否压缩，默认 false
`);
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      "image-url": { type: "string" },
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

  if (!values["image-url"]) {
    console.error("缺少参数：--image-url");
    printHelp();
    process.exitCode = 1;
    return;
  }

  const urls = values["image-url"]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const width = Number(values.width);
  const height = Number(values.height);
  const isCompressed = values.compress;

  const result = await Promise.all(
    urls.map(async (url) => {
      try {
        const cdnUrl = await requestUploadAsset({ src: url, isCompressed, width, height });
        return { key: url, url: cdnUrl };
      } catch (err) {
        return { key: url, url: "", error: err instanceof Error ? err.message : String(err) };
      }
    })
  );
  console.log(JSON.stringify(result, null, 2));
}

main();
