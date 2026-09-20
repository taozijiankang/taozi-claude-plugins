# taozi-claude-plugins

taozi 的 Claude Code 插件市场。

> ⚠️ **桃子科技内部使用**：本插件市场仅供桃子科技内部使用，请勿对外分发或公开传播。

## 现有插件

| 插件 | 类型 | 说明 |
| --- | --- | --- |
| [`image-to-cdn-plugin`](packages/image-to-cdn-plugin) | skill | 提供 `figma-node-to-cdn`、`image-url-to-cdn` 两个 skill，把 Figma 节点或图片地址上传 OSS 转 CDN |

## 安装使用

```bash
# 添加市场（GitHub 远端）
/plugin marketplace add taozijiankang/taozi-claude-plugins

# 安装插件
/plugin install image-to-cdn-plugin@taozi-claude-plugins
```
