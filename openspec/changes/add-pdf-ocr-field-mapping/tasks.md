## 1. Project Setup

- [x] 1.1 Create a Vite + React + TypeScript application structure in the project root.
- [x] 1.2 Add package scripts for development, type checking, building, and previewing the app.
- [x] 1.3 Add PDF rendering dependency and configure the PDF.js worker in a single application entry point.
- [x] 1.4 Create baseline app styling for a left form panel and right PDF preview panel.

## 2. OCR Data Model

- [x] 2.1 Define TypeScript types for OCR documents, fields, page numbers, bounding boxes, and source page dimensions.
- [x] 2.2 Define a deterministic fixture field source for a simple MVP document, including labels, values, PDF positions, and text dimensions.
- [x] 2.3 Write a simple Chinese Markdown test document, such as `fixtures/source/sample-document.zh.md`, that the user can use to create a Word document and export to PDF.
- [x] 2.4 Ensure the Chinese test document contains a small, stable set of fields suitable for form display and PDF highlighting, such as document number, applicant name, date, amount, and approval status.
- [x] 2.5 Add a fixture generation script that creates `public/fixtures/sample-document.pdf` from the deterministic field source.
- [x] 2.6 Add the same fixture generation script or companion script to create `public/fixtures/sample-document.ocr.json` from the deterministic field source, simulating already-completed OCR output.
- [x] 2.7 Ensure generated OCR fixture coordinates use top-left origin, pixel units, 1-based page numbers, `bbox`, `sourcePageWidth`, and `sourcePageHeight`.
- [x] 2.8 Add bundled sample OCR JSON data that includes valid field labels, values, pages, bbox coordinates, and source page sizes.
- [x] 2.9 Document the relationship between the sample PDF fixture and OCR JSON fixture so future tests can verify coordinate alignment.
- [x] 2.10 Add validation or guard logic that detects fields without enough coordinate data to produce a safe highlight.
- [x] 2.11 Implement a pure coordinate scaling utility that maps OCR source coordinates to rendered PDF page coordinates.

## 3. PDF Preview

- [x] 3.1 Implement PDF loading for the bundled fixture PDF file.
- [x] 3.2 Render PDF pages in document order inside the right-side preview panel.
- [x] 3.3 Track each rendered page's actual width and height for overlay coordinate conversion.
- [x] 3.4 Display a visible error state when PDF loading or rendering fails.

## 4. OCR Form Interface

- [x] 4.1 Render OCR fields as a form in the left-side panel with labels and extracted values.
- [x] 4.2 Show a clear empty state when no OCR fields are loaded.
- [x] 4.3 Maintain a single selected field state shared by the form and PDF preview.
- [x] 4.4 Apply a visible selected style to the active form field.

## 5. Field-to-PDF Highlighting

- [x] 5.1 Add an overlay layer aligned to each rendered PDF page.
- [x] 5.2 Draw a visible highlight for the selected field when valid coordinate data is available.
- [x] 5.3 Clear the previous highlight when a different field is selected.
- [x] 5.4 Scroll or navigate the PDF preview to the selected field's source page.
- [x] 5.5 Recalculate highlight position when rendered page dimensions change.

## 6. Automated Testing

- [x] 6.1 Add a unit test runner suitable for the React + TypeScript project, such as Vitest.
- [x] 6.2 Add unit tests for coordinate scaling with same-size, scaled-up, scaled-down, and fractional rendered page dimensions.
- [x] 6.3 Add unit tests for OCR field validation, including missing bbox, missing source dimensions, invalid page, and valid mappable field cases.
- [x] 6.4 Add component tests for OCR form rendering, empty state rendering, selected field styling, and selection state changes.
- [x] 6.5 Add component or integration tests verifying that selecting a field creates the expected highlight overlay from fixture OCR data.
- [x] 6.6 Add fixture-based tests that load the generated OCR JSON fixture and assert every mappable field references an existing PDF page and valid bbox.
- [x] 6.7 Add tests that verify the fixture generation output remains stable or fails with an intentional update path when the deterministic field source changes.

## 7. Real Fixture Verification

- [x] 7.1 Use the generated PDF and OCR fixture as the default demo dataset in development.
- [ ] 7.2 Manually verify each fixture field highlights the intended visual location in the PDF preview.
- [x] 7.3 Record fixture verification notes, including known coordinate tolerance or OCR limitations.
- [x] 7.4 Ensure the app shows a useful state when the real PDF fixture is available but matching OCR fixture data is missing.

## 8. Responsive Behavior and Verification

- [x] 8.1 Ensure the desktop layout shows the OCR form on the left and PDF preview on the right.
- [x] 8.2 Ensure narrow viewports remain usable without hiding either the form or preview.
- [x] 8.3 Run all unit, component, and fixture-based tests before marking implementation complete.
- [x] 8.4 Run type checking and production build before marking implementation complete.
- [ ] 8.5 Manually verify selecting fields updates the PDF highlight and page positioning correctly.
