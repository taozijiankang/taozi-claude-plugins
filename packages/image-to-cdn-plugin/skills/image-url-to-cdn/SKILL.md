---
name: image-url-to-cdn
description: 把图片链接地址转成 CDN 链接。给定一个或多个图片 URL，上传 OSS 返回 CDN 链接。当用户想把图片地址转成 CDN 链接时使用。
disable-model-invocation: false
---

# image-url-to-cdn

把图片链接地址上传 OSS 并返回 CDN 链接。脚本位于 `${CLAUDE_PLUGIN_ROOT}/src/bin/image-url-to-cdn.js`，用 `node` 运行。

## 使用

用户给出一个或多个图片 URL（多个用逗号分隔）：

```bash
node "${CLAUDE_PLUGIN_ROOT}/src/bin/image-url-to-cdn.js" --image-url <url1,url2>
```

## 可选参数

- `--width <n>`、`--height <n>`、`--compress`

运行完成后，把脚本输出的 CDN 链接告知用户。
