# Entity Blueprint Canvas: Execution Plan

A 100% client-side, zero-latency React application for visually designing database entities and generating Spring Boot/Flyway configurations.

## Architecture

The application operates as a pure data-transformation pipeline, entirely in the browser. The URL acts as the single source of truth, and `localStorage` handles persistence.

- **Frontend/Canvas:** React Flow
- **State & Routing:** TanStack Router + Zod (URL search params)
- **Caching/Persistence:** TanStack Query (`localStorage`)
- **File Generation:** JSZip (in-memory zip compilation)

## Roadmap

### Phase 1: Routing & State Contract Definition

_Establish a rock-solid, type-safe data contract so state lives completely inside the URL._

- [/] **1.1 Initialization:** Scaffold the Vite project and install `@xyflow/react`, `@tanstack/react-router`, `@tanstack/react-query`, `zod`, and `jszip`.
- [/] **1.2 Zod Schema:** Define a schema representing the React Flow state (entities, fields, and database relationships).
- [/] **1.3 Router Config:** Configure the `/workspace` route to accept and validate the Zod schema via URL search parameters.
- [/] **1.4 Persistence Sync:** Wire TanStack Query to automatically sync URL state changes into `localStorage` (e.g., `current_draft`) as a background fallback.

### Phase 2: The Interactive React Flow Canvas

_Build the drag-and-drop workspace._

- [ ] **2.1 Custom Entity Node:** Create an `EntityNode` component containing:
  - Table/Class name input.
  - A dynamic list of fields (Name, Type dropdown, Primary Key toggle).
  - An embedded "Add Field" button.
- [ ] **2.2 Handles & Edges:** Configure source (right) and target (left) handles on the `EntityNode` to allow drag-and-drop relationship mapping.
- [ ] **2.3 State Syncing:** Map React Flow's `onNodesChange`, `onEdgesChange`, and `onConnect` callbacks to TanStack Router's navigation function to update URL params instantly.

### Phase 3: Pure TypeScript String Generators

_Create stateless utility functions that transform JSON into code._

- [ ] **3.1 JPA Generator (`jpaGenerator.ts`):** Transform node fields into standard Java strings (includes `@Entity`, `@Table`, `@Id`, data types, and empty constructors).
- [ ] **3.2 Relationship Parser (`relationshipParser.ts`):** Read edge connections to inject `@ManyToOne`, `@OneToMany`, etc., alongside join columns into the Java strings.
- [ ] **3.3 DDL Generator (`ddlGenerator.ts`):** Transform nodes and edges into syntax-valid SQL strings (`CREATE TABLE ...`) for Flyway/Liquibase.

### Phase 4: Tabbed Live Code Viewers

_Display the generated output to the user in real-time._

- [ ] **4.1 Layout:** Build a split-screen or bottom-docked panel below the main React Flow canvas.
- [ ] **4.2 Code Blocks:** Create syntax-highlighted tabs for **JPA Entity Code**, **Flyway SQL**, and **Raw JSON Schema**. Ensure these re-render instantly upon URL state changes.

### Phase 5: Client-Side Project Exporter

_Package the generated strings into a downloadable Maven structure._

- [ ] **5.1 JSZip Setup:** Create an export utility that instantiates `new JSZip()`.
- [ ] **5.2 Directory Scaffolding:** Use project metadata to generate virtual folders:
  - `src/main/java/com/yourcompany/domain/`
  - `src/main/resources/db/migration/`
- [ ] **5.3 Compilation:** Populate the virtual folders with the strings from Phase 3, compile via `zip.generateAsync()`, and trigger a native browser download for the `.zip` file.
