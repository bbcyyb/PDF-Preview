## ADDED Requirements

### Requirement: PDF preview rendering

The system SHALL render a bundled PDF fixture document in a right-side preview panel.

#### Scenario: Render PDF pages

- **WHEN** the application loads the bundled valid PDF fixture
- **THEN** the preview panel displays the PDF pages in document order

#### Scenario: Handle PDF loading failure

- **WHEN** the application cannot load the bundled PDF fixture
- **THEN** the application displays a visible error message instead of an empty preview

### Requirement: OCR field form display

The system SHALL display prepared OCR field data as a form in a left-side panel.

#### Scenario: Display OCR fields

- **WHEN** OCR field data is available
- **THEN** the form displays each field label and extracted value

#### Scenario: Handle missing OCR fields

- **WHEN** no OCR field data is available
- **THEN** the form displays an empty-state message explaining that no fields are loaded

### Requirement: OCR coordinate data model

The system SHALL represent each OCR field with a stable identifier, label, extracted value, page number, bounding box, and source page dimensions.

#### Scenario: Validate mappable field data

- **WHEN** an OCR field includes page number, bounding box, source page width, and source page height
- **THEN** the system can calculate a preview overlay rectangle for that field

#### Scenario: Detect unmappable field data

- **WHEN** an OCR field is missing required coordinate or source page dimension data
- **THEN** the system does not draw a misleading highlight for that field

### Requirement: Field selection highlights PDF source area

The system SHALL highlight the PDF source area for the currently selected OCR form field.

#### Scenario: Select field with valid coordinates

- **WHEN** the user selects a form field that has valid coordinate data
- **THEN** the PDF preview displays a visible highlight around the corresponding source area

#### Scenario: Select field on another page

- **WHEN** the user selects a form field whose source area is on a different PDF page
- **THEN** the preview scrolls or navigates to the corresponding page and displays the highlight there

#### Scenario: Change selected field

- **WHEN** the user selects a different form field
- **THEN** the previous highlight is cleared and the new field's source area is highlighted

### Requirement: Coordinate scaling

The system SHALL scale OCR bounding boxes from source page dimensions to the current rendered PDF page dimensions.

#### Scenario: Render at non-original size

- **WHEN** a PDF page is rendered at a different size than the OCR source page dimensions
- **THEN** the highlight position and size are scaled proportionally to match the rendered page

#### Scenario: Recalculate after preview resize

- **WHEN** the rendered PDF page dimensions change due to layout or zoom changes
- **THEN** the highlight is recalculated using the updated rendered dimensions

### Requirement: Split-pane layout

The system SHALL present OCR form content and PDF preview side by side on desktop-sized screens.

#### Scenario: Desktop layout

- **WHEN** the viewport has sufficient width
- **THEN** the OCR form appears on the left and the PDF preview appears on the right

#### Scenario: Narrow layout

- **WHEN** the viewport width is too small for a usable side-by-side layout
- **THEN** the application remains usable by stacking or otherwise adapting the panels without hiding the form or preview
