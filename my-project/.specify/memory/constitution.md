# Angular App Constitution

## Core Principles

### I. Standalone Components (NON-NEGOTIABLE)
Every component, directive, and pipe must be standalone (`standalone: true`). NgModules are strictly forbidden. Dependencies are declared in the `imports` array of the component metadata. No `AppModule`, `SharedModule`, or any other module file may be created.

### II. Signals-Only State Management
Application state is managed exclusively with Angular Signals (`signal()`, `computed()`, `effect()`). NgRx, BehaviorSubject-based state stores, and other third-party state libraries are prohibited. For cross-component state, use a signal-based service injected via `inject()`. `toSignal()` / `toObservable()` may be used for RxJS interop at boundaries (e.g., HTTP).

### III. Reactive Forms
All forms use Angular Reactive Forms (`ReactiveFormsModule`, `FormBuilder`, `FormGroup`, `FormControl`). Template-driven forms (`FormsModule`, `ngModel`) are prohibited. Validation logic lives in the form definition, not the template.

### IV. Test Coverage (NON-NEGOTIABLE)
Every component, service, and pipe must have a corresponding `*.spec.ts` file with Jasmine/Karma unit tests. Tests must cover: component creation, signal state changes, form validation logic, and service methods. No feature is considered complete without passing tests.

### V. Simplicity & Dependency Discipline
Follow YAGNI. The project must remain dependency-light. No UI component libraries (e.g., Angular Material, PrimeNG, NGX-Bootstrap) may be added unless explicitly requested. New `npm` dependencies require justification. Prefer Angular built-ins and vanilla SCSS over third-party abstractions.

## Technology Stack

- **Framework**: Angular 18+ (standalone API, no NgModules)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: SCSS — component-scoped styles using `styleUrl` (single file). Global tokens and resets in `styles.scss`. No inline styles.
- **State**: Angular Signals only (`signal`, `computed`, `effect`, `toSignal`)
- **Forms**: Angular Reactive Forms only
- **Testing**: Jasmine + Karma (Angular CLI default). One `*.spec.ts` per source file.
- **HTTP**: Angular `HttpClient` with typed responses. Wrap in services — never call `HttpClient` directly from components.
- **Routing**: Angular Router with lazy-loaded routes using `loadComponent()`

## Development Workflow

- **File Naming**: Follow Angular CLI conventions — `feature-name.component.ts`, `feature-name.service.ts`, `feature-name.component.spec.ts`, etc.
- **Folder Structure**: Feature-based folders under `src/app/`. Shared utilities in `src/app/shared/`. Core services (singletons) in `src/app/core/`.
- **Component API**: Prefer `input()` signal-based inputs and `output()` signal-based outputs over `@Input()`/`@Output()` decorators where Angular version supports it.
- **Change Detection**: Use `ChangeDetectionStrategy.OnPush` on all components.
- **Injection**: Use `inject()` function instead of constructor injection.
- **No `any`**: TypeScript `any` type is prohibited. Use `unknown` and type-narrow, or define explicit interfaces/types.

## Governance

This constitution supersedes all other practices and style decisions for this project. Any deviation requires explicit documentation of the reason and the user's approval. All code reviews must verify compliance with these principles before acceptance.

**Version**: 1.0.0 | **Ratified**: 2026-07-13 | **Last Amended**: 2026-07-13
