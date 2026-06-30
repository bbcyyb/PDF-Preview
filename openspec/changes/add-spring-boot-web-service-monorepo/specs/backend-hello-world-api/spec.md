## ADDED Requirements

### Requirement: 后端 Hello World API
后端服务 SHALL 暴露一个 Hello World HTTP API，用于确认 Spring Boot 服务正在运行。

#### Scenario: 请求 Hello World 消息
- **WHEN** 客户端向 `/api/hello` 发送 GET 请求
- **THEN** 后端响应 HTTP 200
- **AND** 响应体包含一个 JSON 对象，其中 message 为 `Hello, World!`

#### Scenario: 响应内容类型
- **WHEN** 客户端向 `/api/hello` 发送 GET 请求
- **THEN** 后端使用 JSON 内容类型响应

### Requirement: 后端应用运行时
后端服务 SHALL 作为 Java 17 Spring Boot Web 应用运行，并独立于前端应用。

#### Scenario: 不依赖前端启动后端
- **WHEN** 开发者从后端工作区启动后端应用
- **THEN** 后端启动时不要求前端开发服务器正在运行

#### Scenario: 使用自动化测试验证后端
- **WHEN** 执行后端测试
- **THEN** Hello World API 行为通过自动化测试验证
