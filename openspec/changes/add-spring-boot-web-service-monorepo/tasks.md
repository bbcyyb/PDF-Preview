## 1. Monorepo 结构

- [x] 1.1 创建 `frontend/` 和 `backend/` 应用目录。
- [x] 1.2 将现有 Vite 前端包、源码、公开固定样例、前端专用 `docs/`、`fixtures/`、脚本、测试以及 TypeScript/Vite/Vitest 配置迁移到 `frontend/`。
- [x] 1.3 更新前端相对路径和包元数据，使迁移后的前端可以从 `frontend/` 运行、测试、类型检查和构建。
- [x] 1.4 更新根目录包元数据或脚本，将前端命令委托到新的工作区位置。
- [x] 1.5 更新仓库文档和项目指南，描述新的 monorepo 布局、命令和分层 `.gitignore` 规则。

## 2. 后端服务

- [x] 2.1 在 `backend/` 下创建 Java 17 Spring Boot 应用，包含 Maven 构建配置。
- [x] 2.2 添加后端应用入口。
- [x] 2.3 实现 `GET /api/hello` 的 REST 控制器，返回包含 message `Hello, World!` 的 JSON。
- [x] 2.4 添加后端自动化测试，验证 HTTP 200、JSON 内容类型和 Hello World 响应体。
- [x] 2.5 确认后端可以独立于前端开发服务器启动和运行。

## 3. 验证

- [x] 3.1 从新的前端位置运行前端类型检查。
- [x] 3.2 从新的前端位置运行前端自动化测试。
- [x] 3.3 从新的前端位置运行前端生产构建。
- [x] 3.4 从后端位置运行后端自动化测试/构建。
- [x] 3.5 运行 `npx openspec validate --all`。
