# pdf-ocr-field-mapping 规范

## Purpose
定义 PDF 预览、OCR 字段表单展示、字段坐标映射和选中字段高亮定位能力，确保用户能够在 PDF 原文中确认 OCR 字段的来源位置。
## Requirements
### Requirement: PDF 预览渲染

系统 SHALL 在右侧预览面板中渲染随项目提供的 PDF fixture 文档。

#### Scenario: 渲染 PDF 页面

- **WHEN** 应用加载随项目提供的有效 PDF fixture
- **THEN** 预览面板按文档顺序显示 PDF 页面

#### Scenario: 处理 PDF 加载失败

- **WHEN** 应用无法加载随项目提供的 PDF fixture
- **THEN** 应用显示可见的错误消息，而不是显示空白预览区域

### Requirement: OCR 字段表单展示

系统 SHALL 在左侧面板中以表单形式展示已准备好的 OCR 字段数据。

#### Scenario: 显示 OCR 字段

- **WHEN** OCR 字段数据可用
- **THEN** 表单显示每个字段的标签和提取值

#### Scenario: 处理 OCR 字段缺失

- **WHEN** 没有可用的 OCR 字段数据
- **THEN** 表单显示空状态消息，说明当前没有加载字段

### Requirement: OCR 坐标数据模型

系统 SHALL 用稳定标识、标签、提取值、页码、边界框和来源页面尺寸表示每个 OCR 字段。

#### Scenario: 校验可映射字段数据

- **WHEN** OCR 字段包含页码、边界框、来源页面宽度和来源页面高度
- **THEN** 系统能够为该字段计算预览 overlay 矩形

#### Scenario: 检测不可映射字段数据

- **WHEN** OCR 字段缺少必需的坐标数据或来源页面尺寸数据
- **THEN** 系统不得为该字段绘制可能误导用户的高亮

### Requirement: 字段选中后高亮 PDF 来源区域

系统 SHALL 高亮当前选中的 OCR 表单字段在 PDF 中的来源区域。

#### Scenario: 选择具有有效坐标的字段

- **WHEN** 用户选择具有有效坐标数据的表单字段
- **THEN** PDF 预览在对应来源区域周围显示可见高亮

#### Scenario: 选择位于其他页面的字段

- **WHEN** 用户选择的表单字段来源区域位于其他 PDF 页面
- **THEN** 预览区域滚动或导航到对应页面，并在该页面显示高亮

#### Scenario: 切换选中字段

- **WHEN** 用户选择另一个表单字段
- **THEN** 原有高亮被清除，新字段的来源区域被高亮

### Requirement: 坐标缩放

系统 SHALL 将 OCR 边界框从来源页面尺寸缩放到当前 PDF 页面渲染尺寸。

#### Scenario: 以非原始尺寸渲染

- **WHEN** PDF 页面渲染尺寸与 OCR 来源页面尺寸不同
- **THEN** 高亮的位置和尺寸按比例缩放，以匹配渲染后的页面

#### Scenario: 预览尺寸变化后重新计算

- **WHEN** 布局变化或缩放变化导致 PDF 页面渲染尺寸改变
- **THEN** 高亮使用更新后的渲染尺寸重新计算

### Requirement: 分栏布局

系统 SHALL 在桌面尺寸屏幕上并排展示 OCR 表单内容和 PDF 预览。

#### Scenario: 桌面布局

- **WHEN** 视口宽度足够
- **THEN** OCR 表单显示在左侧，PDF 预览显示在右侧

#### Scenario: 窄屏布局

- **WHEN** 视口宽度不足以提供可用的并排布局
- **THEN** 应用通过堆叠或其他面板自适应方式保持可用，不隐藏表单或预览
