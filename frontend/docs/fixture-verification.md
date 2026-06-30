# Fixture 验证说明

示例 fixture 文件由 `frontend/scripts/generate-fixtures.mjs` 生成。

- PDF fixture: `frontend/public/fixtures/sample-document.pdf`
- OCR fixture: `frontend/public/fixtures/sample-document.ocr.json`
- 源文档辅助材料：`frontend/fixtures/source/sample-document.zh.md`

OCR 坐标使用左上角原点、像素单位、从 1 开始的页码，并使用与生成 PDF 页面相同的 595 x 842 来源尺寸。生成器使用同一份确定性字段来源输出 OCR `bbox`，并在 PDF 值周围绘制矩形，因此 fixture 对齐应在 PDF.js canvas 缩放容差内保持稳定。

当前自动化验证覆盖：

- 每个 OCR 字段都引用现有页面。
- 每个可映射字段都有有效 bbox 和来源尺寸。
- OCR JSON 与已提交的确定性 fixture 来源保持一致。
- 高亮 overlay 缩放结果匹配预期 fixture 坐标。
- `npm run fixtures:check` 确认生成的 fixture 文件稳定。

最终仍需要在浏览器中手动确认 PDF.js 渲染和滚动定位行为。
