# 项目指南

## 个性化诉求

- 所有的openspec文档，除了涉及流程的关键字外，其余都用中文进行描述。

## 项目概述

本项目是一个 Monorepo，其中包含：

- 一个 React + TypeScript + Vite Web 应用，用于展示 OCR 字段与 PDF 原文位置之间的映射关系。
- 一个 Java 17 + Spring Boot + Maven 后台服务。

项目目标：

- 展示 OCR 字段列表。
- 在 PDF 中定位并高亮当前选中字段的来源区域。
- 使用确定性 fixture 验证坐标映射和联动行为。

非目标：

- 不在前端执行 OCR。
- 不实现 PDF/OCR 上传流程，除非 OpenSpec 后续明确扩展。
- 不实现字段编辑、保存、账号或协作能力。

## 项目地图

- `frontend/src/components/`：React UI 组件。
- `frontend/src/domain/`：纯逻辑，包括坐标转换和 OCR 字段校验。
- `frontend/src/fixtures/`：fixture 加载和样本数据适配。
- `frontend/public/fixtures/`：示例 PDF 和 OCR JSON。
- `frontend/fixtures/`：前端 fixture 源文档和辅助材料。
- `frontend/docs/`：前端 fixture 验证等前端专用文档。
- `frontend/scripts/`：前端 fixture 生成和校验脚本。
- `backend/src/main/`：Spring Boot 应用源码。
- `backend/src/test/`：后端自动化测试。
- `openspec/`：能力规格和变更记录。
- `.agents/skills/`：项目级 Codex skills。

## Skills 加载策略

- 项目级 skill 放在 `.agents/skills/<skill-name>/SKILL.md`，用于沉淀本仓库可复用的工作流。
- Codex 会通过 skill 的 `name` 和 `description` 判断是否触发；明确指定时优先使用 `$skill-name`。
- 本项目的 OpenSpec 工作流使用 `$opsx` skill；输入 `opsx:explore ...`、`opsx:propose ...`、`opsx:apply ...` 等无斜杠快捷语法时，也应按 `$opsx` 的对应动作处理。
- `~/.codex/prompts/opsx-*.md` 是迁移来源，不作为本项目的主要入口；项目内以 `.agents/skills/opsx/` 为准。

## 架构约束

- 保持前端为单页 Web 应用；除非 OpenSpec 明确扩展，不引入 SSR 框架或桌面端运行时。
- 前端和后端必须位于各自应用目录内，通过根目录脚本进行编排。
- UI 组件、领域逻辑和 fixture/数据适配逻辑应保持职责分离。
- 后端使用 Java 17 + Spring Boot + Maven；不把 PDF/OCR 映射逻辑迁移到后端，除非 OpenSpec 后续明确扩展。
- 涉及用户可见能力变化时，必须同步更新 OpenSpec。

## 代码规范

- 非平凡纯逻辑不要写在 React 组件中；坐标转换、OCR 校验和 fixture 解析应放在 `frontend/src/domain/` 或专门模块。
- 组件 props 必须显式声明类型；共享领域类型放在专门 TypeScript 模块中。
- 不为小范围功能引入大型依赖；新增依赖必须有明确用途。
- 根目录 `.gitignore` 只放仓库通用规则；前端技术栈规则维护在 `frontend/.gitignore`，后端技术栈规则维护在 `backend/.gitignore`。
- `dist/`、`fixtures/`、`docs/` 属于前端应用边界，应放在 `frontend/` 下。

## 运行步骤

### 调试

```bash
npm run dev -- --host 127.0.0.1
```

后端：

```bash
mvn -f backend/pom.xml spring-boot:run
```

### 类型检查

```bash
npm run typecheck
```

### 单元测试

```bash
npm run test
```

### 构建

```bash
npm run build
```

### OpenSpec 校验

```bash
npx openspec validate --all
```

## 完成标准

- 类型检查通过。
- 自动化测试通过。
- 生产构建通过。
- 如果能力或行为发生变化，OpenSpec 校验通过。
