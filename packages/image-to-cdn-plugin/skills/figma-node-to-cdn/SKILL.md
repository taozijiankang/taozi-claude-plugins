---
name: figma-node-to-cdn
description: 把 Figma 设计稿节点转成 CDN 链接。给定 Figma 链接或文件 key + 节点 id，先调用 Figma REST API 导出图片，再上传 OSS 返回 CDN 链接。当用户想把 Figma 设计稿节点转成 CDN 链接时使用。
disable-model-invocation: false
---

# figma-node-to-cdn

把 Figma 节点导出为图片并上传 OSS 返回 CDN 链接。脚本位于 `${CLAUDE_PLUGIN_ROOT}/src/bin/figma-node-to-cdn.js`，用 `node` 运行。

## 使用

用户给出 Figma 链接，或文件 key + 节点 id：

1. 确定 Figma Token：优先使用环境变量 `FIGMA_API_KEY`；若未设置，向用户索取 Figma Personal Access Token（`figd_` 开头）。
2. 从链接中提取 `fileKey`（`/design/<fileKey>/` 部分）和 `nodeIds`（`node-id=1-2` 对应 `1-2`，多个用逗号分隔）。
3. 运行脚本：

   ```bash
   FIGMA_API_KEY=<token> node "${CLAUDE_PLUGIN_ROOT}/src/bin/figma-node-to-cdn.js" --file-key <fileKey> --node-ids <id1,id2>
   ```

   （Token 已在环境变量中时可省略前缀；**不要在输出里回显 Token**。）

## 可选参数

- `--scale <n>`、`--format <png|jpg|svg|pdf>`
- `--width <n>`、`--height <n>`、`--compress`

运行完成后，把脚本输出的 CDN 链接告知用户。
