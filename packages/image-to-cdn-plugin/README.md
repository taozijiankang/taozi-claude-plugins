# image-to-cdn-plugin

把图片上传 OSS 并转换为 CDN 链接。提供两个 **skill 型** skill（无 hook），会根据任务描述自动触发，也可以手动运行。

## 提供的 skill

| skill | 说明 |
| --- | --- |
| `figma-node-to-cdn` | 给定 Figma 链接或文件 key + 节点 id，先导出图片再上传，返回 CDN 链接 |
| `image-url-to-cdn` | 给定一个或多个图片 URL，直接上传并返回 CDN 链接 |

## 使用方式

- **自动触发**：直接告诉 Claude「把这张图转成 CDN 链接」，或给出 Figma 链接 / 图片 URL，skill 会按描述匹配并自动执行。
- **手动触发**：运行 `/figma-node-to-cdn` 或 `/image-url-to-cdn`。

## 前置条件

- `figma-node-to-cdn` 需要一个 Figma Personal Access Token（`figd_` 开头），通过环境变量 `FIGMA_API_KEY` 提供，或运行命令时按提示输入。
- 两个 skill 都需要 OSS 上传地址，通过环境变量 `IMAGE_TO_CDN_PLUGIN_UPLOAD_URL` 提供。

## 安装

```bash
/plugin install image-to-cdn-plugin@taozi-claude-plugins
```
