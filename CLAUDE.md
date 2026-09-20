# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
pnpm install                     # 安装依赖
pnpm run typecheck               # 所有包类型检查（turbo）
pnpm run build                   # 所有包构建（turbo，产物在各包 dist/）
pnpm run test                    # 所有包测试（turbo，依赖 build）

# 单包操作（在对应包目录下）
pnpm run typecheck               # 单包类型检查
pnpm run build                   # 单包构建
node --test test/<file>.test.js  # 单文件测试
```

## 架构概览

pnpm + turbo monorepo，每个 `packages/*` 子包是一个 Claude Code 插件，通过 marketplace.json 的相对路径 `source`（`./packages/<name>`）直接从仓库分发，不发布 npm。

### 插件类型

**hook 型**：含 `hooks/hooks.json` 注册 `PreToolUse` 等事件，Claude Code 触发时执行 `dist/` 下 esbuild 打包好的 `.mjs` 脚本。`hooks.json` 里用 `${CLAUDE_PLUGIN_ROOT}/dist/...` 引用路径。

**command 型**：含 `commands/<name>.md`，文件内容即 slash command 的指令，Claude 按此执行。无 hook、无 dist，脚本（如有）直接放 `src/bin/` 由命令文档调用。

**skill 型**：含 `skills/<name>/SKILL.md`（一个 skill 一个目录）。frontmatter 写 `name` + `description`，`description` 是触发信号，Claude 会根据任务相关性自动加载正文，也能 `/name` 手动触发。无 hook、无 dist，脚本放 `src/bin/`，正文里用 `${CLAUDE_PLUGIN_ROOT}/src/bin/...` 字面量占位符引用（运行时替换为插件安装目录）。

### 新增插件

1. 在 `packages/` 下新建目录（workspace 通配符自动识别）
2. 必须包含 `.claude-plugin/plugin.json`（`name` / `description` / `author`）和 `package.json`（`name` 用 `@taozi-claude-plugins/<pkg>` 命名空间，仅作标识，插件不发布 npm）；`description` 需标注「桃子科技内部使用」
3. `version` 字段无需手动维护，CI 统一写入
4. `marketplace.json` 由 `.node/update-marketplace.js` 自动生成，**不要手动修改**

### 发布流程（自动）

推到 `master` 触发 CI（`.github/workflows/ci-publish.yml`）：

1. `pnpm install` → `typecheck` → `build` → `test`
2. `iteration-version.js` 从 GitHub tag 算下一 patch 版本，写回根 `package.json`、各 `packages/*/package.json`、`packages/*/.claude-plugin/plugin.json`。主/次版本号由仓库变量 `MAJOR_VN` / `MINOR_VN` 控制。
3. `update-marketplace.js` 扫描 `packages/` 重写 `marketplace.json`（`source` 用相对路径 `./packages/<name>`，插件不发布 npm）
4. 提交版本变更，打 `vX.Y.Z` tag，创建 GitHub Release
