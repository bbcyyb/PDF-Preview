# Project Guidelines

## Tech Stack

- Use stable, mainstream versions of React and TypeScript.
- Use Vite as the application build tool and development server.
- Keep the project as a React + TypeScript web application unless a future OpenSpec change explicitly expands the scope.

## Dependencies

- Prefer popular, well-maintained third-party libraries for common UI and infrastructure needs.
- Do not rebuild mature functionality that is already provided by stable ecosystem libraries.
- Avoid niche, unmaintained, or low-adoption components unless there is a clear technical reason documented in the change design.
- Keep dependencies purposeful; do not add a large framework or library for a small isolated feature.

## React Structure

- Build the UI with focused, reusable React components.
- Do not place large amounts of unrelated UI, state management, PDF rendering, OCR form rendering, and coordinate logic in a single `.tsx` file.
- Separate pure logic from React components where practical, especially coordinate conversion, OCR validation, and fixture handling.
- Keep component props typed explicitly and keep shared domain types in dedicated TypeScript modules.

## Testing

- Unit tests are required for non-trivial logic.
- Coordinate conversion, OCR field validation, and fixture parsing must have focused tests.
- Component behavior that drives core UX, such as selecting a form field and showing a PDF highlight, should be covered by component or integration tests.
- Run type checking, automated tests, and a production build before marking implementation work complete.
