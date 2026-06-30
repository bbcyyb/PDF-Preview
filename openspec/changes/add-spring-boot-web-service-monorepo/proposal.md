## 原因

当前项目是位于仓库根目录的单一前端应用，但下一阶段需要新增后端服务，同时保持前端和后端职责分离。现在引入 monorepo 结构，可以为每个应用提供清晰边界，并让后端能力在不影响现有 PDF/OCR UI 的前提下继续演进。

## 变更内容

- **BREAKING**: 将仓库重构为 monorepo，前端和后端使用独立的应用目录。
- 将现有 React + TypeScript + Vite PDF/OCR 前端迁移到专门的前端工作区，且不改变用户可见行为。
- 在专门的后端工作区中新增 Java 17 + Spring Boot Web 服务。
- 新增一个初始 Hello World HTTP API，用于验证后端服务可以独立运行。
- 更新项目脚本、文档和验证命令，使开发者可以分别运行、测试和构建前端与后端。

## 能力

### 新增能力
- `backend-hello-world-api`: 提供一个最小 Spring Boot Web 服务，并暴露 Hello World 端点。

### 修改能力
- 无。

## 影响

- 仓库布局从根目录 Vite 前端应用变为包含独立前端和后端目录的 monorepo。
- 前端包文件、源码、固定样例资源、测试以及 Vite/TypeScript 配置迁移到前端应用目录下。
- 后端引入 Java 17、Spring Boot、Maven 构建文件、应用源码和后端测试。
- 根目录开发命令和文档需要指向新的前端与后端位置。
