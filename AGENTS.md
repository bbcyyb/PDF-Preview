# 项目指南

## 项目概述

本项目是一个 React + TypeScript + Vite Web 应用，用于展示 OCR 字段与 PDF 原文位置之间的映射关系。

项目目标：

- 展示 OCR 字段列表。
- 在 PDF 中定位并高亮当前选中字段的来源区域。
- 使用确定性 fixture 验证坐标映射和联动行为。

非目标：

- 不在前端执行 OCR。
- 不实现 PDF/OCR 上传流程，除非 OpenSpec 后续明确扩展。
- 不实现字段编辑、保存、账号或协作能力。

## 项目地图

- `src/components/`：React UI 组件。
- `src/domain/`：纯逻辑，包括坐标转换和 OCR 字段校验。
- `src/fixtures/`：fixture 加载和样本数据适配。
- `public/fixtures/`：示例 PDF 和 OCR JSON。
- `openspec/`：能力规格和变更记录。

## 架构约束

- 保持为前端单页 Web 应用；除非 OpenSpec 明确扩展，不引入服务端应用、SSR 框架或桌面端运行时。
- UI 组件、领域逻辑和 fixture/数据适配逻辑应保持职责分离。
- 涉及用户可见能力变化时，必须同步更新 OpenSpec。

## 代码规范

- 非平凡纯逻辑不要写在 React 组件中；坐标转换、OCR 校验和 fixture 解析应放在 `src/domain/` 或专门模块。
- 组件 props 必须显式声明类型；共享领域类型放在专门 TypeScript 模块中。
- 不为小范围功能引入大型依赖；新增依赖必须有明确用途。

## 运行步骤

### 调试

```bash
npm run dev -- --host 127.0.0.1
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
