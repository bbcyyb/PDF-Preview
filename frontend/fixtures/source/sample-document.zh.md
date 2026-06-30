# OCR 字段映射测试文档

本文档用于生成或人工复核 MVP 测试 PDF。配套 OCR JSON 由确定性字段源生成，用于验证表单字段和 PDF 坐标高亮是否对齐。

| 字段 | 值 |
| --- | --- |
| 文档编号 | DOC-2026-001 |
| 申请人 | Li Ming |
| 申请日期 | 2026-06-25 |
| 金额 | CNY 12,800.00 |
| 审批状态 | Approved |

坐标约定：OCR fixture 使用左上角原点、像素单位、1-based 页码，并为每个字段保存 bbox、sourcePageWidth 和 sourcePageHeight。
