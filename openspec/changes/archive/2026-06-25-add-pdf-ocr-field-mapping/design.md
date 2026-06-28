## 背景

项目当前只有 OpenSpec 配置，还没有应用代码。目标是构建一个浏览器端 React + TypeScript MVP：左侧展示 OCR 字段表单，右侧展示 PDF 预览，用户选中字段后在 PDF 上标出该字段来源区域。

输入数据分为两类：项目内置测试 PDF，以及配套的预生成 OCR JSON。OCR JSON 可以由项目脚本根据 PDF fixture 的字段定义“模拟 OCR 结果”生成，不要求接入真实 OCR 工具。OCR JSON 需要包含文本值、字段标签、页码、文本坐标和坐标来源页面尺寸，否则前端无法在不同缩放比例下稳定还原位置。

## 目标与非目标

**目标：**

- 创建可运行的 Vite + React + TypeScript Web 应用。
- 在右侧渲染 PDF 页面，并支持多页纵向预览。
- 在左侧以表单形式展示 OCR 字段和值。
- 支持用户点击或聚焦表单字段后，高亮对应 PDF 页面的来源区域。
- 支持当前 PDF 渲染尺寸变化时，将 OCR 坐标按比例转换为 overlay 坐标。
- 使用简单的内置 PDF/OCR fixture 完成核心联动验证。
- 保持数据模型清晰，方便后续替换为后端接口、上传流程、真实 OCR 输出或编辑工作流。

**非目标：**

- 不在前端执行 OCR。
- 不实现用户上传 PDF 或 OCR JSON。
- 不实现字段编辑后的持久化保存。
- 不实现用户账号、权限、审计或协作标注。
- 不实现复杂批注工具，例如拖拽修改 bbox、合并拆分字段或训练模板。
- 不支持所有可能的 OCR 坐标系统；MVP 只支持带原始页面尺寸的像素坐标，并为后续扩展保留字段。

## 决策

1. 使用 Vite + React + TypeScript 构建 Web MVP。
   - 理由：Vite 启动和构建简单，React 适合管理选中字段、PDF 页渲染状态和表单/预览联动状态，TypeScript 能约束 OCR 数据结构。
   - 替代方案：Next.js。当前不需要 SSR、路由或服务端能力，引入 Next.js 会增加不必要复杂度。

2. 使用 `pdfjs-dist` 作为 PDF 渲染基础。
   - 理由：`pdfjs-dist` 能直接控制每页 canvas 渲染和 viewport 尺寸，方便在同一容器内叠加绝对定位 overlay。
   - 替代方案：`react-pdf`。封装更友好，但精确控制 worker、canvas、页面尺寸和 overlay 生命周期时约束更多。

3. OCR 字段使用显式坐标模型。
   - 数据至少包含 `id`、`label`、`value`、`page`、`bbox`、`sourcePageWidth` 和 `sourcePageHeight`。
   - 理由：坐标转换必须知道 OCR 产生时的页面尺寸，不能只保存 bbox，否则 PDF 渲染缩放后无法稳定定位。
   - 替代方案：保存归一化坐标。归一化坐标更通用，但很多 OCR 工具默认输出像素坐标；MVP 先支持像素坐标，后续可增加归一化适配器。

4. PDF 页面采用 canvas 渲染，highlight 采用同尺寸 overlay 层。
   - 理由：canvas 负责 PDF 内容，overlay 用 HTML/SVG 负责交互高亮，两者分离，避免重绘 PDF 才能更新高亮。
   - 替代方案：直接在 canvas 上绘制高亮。实现初期较短，但选中字段变化、动画和可访问性状态都更难维护。

5. 坐标转换由独立纯函数负责。
   - 公式：`left = bbox.x * renderedWidth / sourcePageWidth`，`top = bbox.y * renderedHeight / sourcePageHeight`，宽高同理。
   - 理由：转换逻辑需要单独测试，避免散落在组件中导致页面缩放、多页和不同 OCR 数据源时难以排查。
   - 替代方案：在组件内直接计算。短期代码少，但难以验证边界条件。

6. 选中字段状态集中管理。
   - 使用 `selectedFieldId` 驱动表单高亮、PDF overlay 高亮和滚动定位。
   - 理由：单一状态源能避免左侧和右侧显示不一致。
   - 替代方案：各组件维护局部选中状态。实现简单场景可行，但联动行为容易不同步。

7. 测试 PDF 和标准 OCR fixture 由同一个可重复生成流程产生。
   - 主测试数据使用一个简单合成文档，字段内容、页面尺寸和文本位置固定。MVP 文档可以只包含少量代表性字段，例如文档标题、姓名、日期、编号和金额。
   - PDF fixture 和标准 OCR JSON fixture 应由同一个字段定义生成，保证坐标真值稳定、可提交、可重复验证。
   - 标准 OCR JSON 可以“假装已经 OCR”：它不必来自真实 OCR 引擎，而是由生成脚本直接输出字段文本和坐标，用作前端映射逻辑的确定性真值。
   - 标准 OCR JSON 使用前端统一坐标系统：左上角原点、像素单位、`bbox: { x, y, width, height }`、1-based `page`，并包含 `sourcePageWidth` 和 `sourcePageHeight`。
   - 如果 PDF 生成工具使用左下角坐标系，生成 OCR JSON 时必须转换为左上角坐标，例如 `ocrY = pageHeight - pdfY - textHeight`。
   - 实际 OCR 工具输出不属于 MVP 必需范围；后续如果要接入 PaddleOCR、Tesseract 或云 OCR，再增加 adapter/兼容性样本测试 `raw OCR output -> normalized OcrDocument`。
   - 理由：当前目标是验证预览/表单/高亮联动，不是验证 OCR 质量；确定性 fixture 能隔离前端坐标映射问题。
   - 替代方案：只使用真实 OCR 工具输出。更贴近生产输入，但测试结果不稳定，且难以判断坐标错误来自 OCR 还是前端映射逻辑。

## 风险与取舍

- OCR 坐标原点不一致，例如某些工具使用左下角原点 → 在数据模型中明确 MVP 使用左上角原点；后续通过 adapter 支持其他坐标系统。
- PDF 渲染尺寸变化导致高亮错位 → 页面渲染完成后记录实际 canvas 尺寸，并基于实际尺寸计算 overlay。
- 多页 PDF 滚动定位不稳定 → 为每页维护 DOM ref，选中字段后滚动到对应页容器，再显示该页高亮。
- 大 PDF 渲染性能较差 → MVP 可先全部渲染示例 PDF；后续再引入虚拟滚动或懒渲染。
- OCR JSON 与 PDF 不匹配 → 示例数据中保留文档标识或文件名说明；MVP 只提示数据缺失或页码越界，不做复杂校验。
- `pdfjs-dist` worker 配置容易出错 → 在应用入口集中配置 worker，并在构建验证中覆盖 PDF 加载路径。
- 测试 fixture 与后续真实 OCR 输出差异较大 → 将确定性 fixture 用作 MVP 主测试真值；真实 OCR adapter 测试推迟到接入真实 OCR 数据源时再补充。
