# AGENTS.md - Developer & Agent Guide for EntityForge

Welcome to **EntityForge**. This document provides context, architectural design principles, directory structures, commands, and code conventions for AI agents and human developers working on this codebase.

---

## 1. Project Overview & Architecture

**EntityForge** is a 100% client-side, zero-latency web application for visually designing database schemas/entities on an interactive canvas and generating production-ready **Spring Boot (Data JPA)** domain models and **Flyway/Liquibase SQL DDL** migrations in real-time.

### Key Architectural Principles

- **Browser-Only Execution**: Pure data-transformation pipeline in the client. No backend server or remote database required for core features.
- **URL as Single Source of Truth**: The `/workspace` route stores the active canvas state serialized in the `draft` search parameter (`/workspace?draft=...`), validated via Zod schemas.
- **Offline & Fallback Persistence**: Synced debounced (300ms) to `localStorage` (`current_draft`) with full Undo/Redo history (up to 50 states).
- **Client-Side Export**: Full Spring Boot Maven project `.zip` archives (with Maven wrapper, `pom.xml`, entities, enums, migrations, config properties, entry point, tests) compiled entirely in-browser via JSZip.

---

## 2. Technology Stack

| Layer / Concern | Technology | Notes |
| :--- | :--- | :--- |
| **Framework & Runtime** | [React 19](https://react.dev/), [TypeScript 6](https://www.typescriptlang.org/) | Strict mode, `ES2022`/`ESNext`, `verbatimModuleSyntax` |
| **Bundler & Meta-framework** | [Vite 8](https://vite.dev/), [TanStack Start](https://tanstack.com/start) | Cloudflare plugin enabled on build |
| **Routing & Search Params** | [TanStack Router](https://tanstack.com/router) | File-based routing in `src/routes/`, Zod search validation |
| **Canvas & Flow Diagrams** | [@xyflow/react (React Flow)](https://reactflow.dev/) | Custom nodes (`entity`), custom edges (`relationship`) |
| **Auto-Layout** | [@dagrejs/dagre](https://github.com/dagrejs/dagre) | Directed graph auto-positioning for entity nodes |
| **State & Data Fetching** | [TanStack Query](https://tanstack.com/query), Custom React Hooks | Devtools integrated |
| **Validation & Contracts** | [Zod 4](https://zod.dev/) | Node, Field, Index, Edge, and Workspace schemas |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/), Radix UI, Lucide Icons | Custom Duke/Java color scheme with Light/Dark modes |
| **Archive Generation** | [JSZip](https://stuk.github.io/jszip/) | In-memory ZIP builder and browser blob downloader |
| **Testing** | [Vitest](https://vitest.dev/), Testing Library, jsdom | Unit & component testing |
| **Linting & Formatting** | [ESLint 9](https://eslint.org/) (`@tanstack/eslint-config`), [Prettier 3](https://prettier.io/) | Auto-formatting with `semi: false`, `singleQuote: true` |
| **Package Manager** | [pnpm](https://pnpm.io/) | Monorepo/workspace ready (`pnpm-lock.yaml`) |

---

## 3. Repository Structure

```
entityforge/
├── .cursorrules               # Rules for Shadcn UI component additions
├── eslint.config.js           # ESLint configuration (@tanstack/eslint-config)
├── package.json               # Scripts, dependencies, and project metadata
├── PHASES.md                  # Project roadmap and implementation phases
├── prettier.config.js         # Prettier formatting rules
├── tsconfig.json              # TypeScript compiler configuration & path aliases
├── tsr.config.json            # TanStack Router CLI config
├── vite.config.ts             # Vite configuration with TanStack Start & Tailwind plugins
├── wrangler.json              # Cloudflare deployment configuration
├── public/                    # Static public assets
│   ├── favicon.ico
│   └── mvn/                   # Maven wrapper binaries & scripts bundled in zip exports
│       ├── mvnw
│       ├── mvnw.cmd
│       └── .mvn/wrapper/maven-wrapper.properties
└── src/
    ├── router.tsx             # TanStack Router instance creation & configuration
    ├── routeTree.gen.ts       # Auto-generated route tree (do not edit manually)
    ├── styles.css             # Theme tokens, font imports, Tailwind CSS, highlight.js styles
    ├── routes/                # File-based routes
    │   ├── __root.tsx         # Root layout (theme script, Devtools, Sonner Toaster)
    │   ├── index.tsx          # Landing page (hero, features, quick actions)
    │   ├── workspace.tsx      # Canvas workspace route with ?draft= search param
    │   └── documentation.tsx  # User guide & documentation page
    ├── hooks/                 # Reusable React hooks
    │   ├── useWorkspace.ts    # Workspace state, undo/redo, debounced URL & localStorage sync
    │   └── useTheme.ts        # Light/Dark mode state management
    ├── components/            # UI and feature components
    │   ├── canvas.tsx         # React Flow interactive canvas wrapper
    │   ├── entity-node.tsx    # Custom Entity node (table name, fields, PK, indexes, handle)
    │   ├── relationship-edge.tsx # Custom Edge with relationship type dropdown (1:M, M:1, 1:1, M:M)
    │   ├── workspace-header.tsx  # Workspace top bar (Add Entity, Auto Layout, Export, Undo/Redo)
    │   ├── code-viewer.tsx    # Real-time code preview tabs (JPA Java, Flyway SQL, JSON Schema)
    │   ├── export-dialog.tsx  # Modal for configuring & downloading Spring Boot ZIP project
    │   ├── confirm-dialog.tsx # Reset confirmation modal
    │   ├── theme-toggle.tsx   # Theme switcher button
    │   ├── header.tsx         # Shared marketing/documentation header
    │   ├── not-found.tsx      # 404 Route component
    │   ├── error-fallback.tsx # TanStack Router error boundary fallback
    │   └── ui/                # Shadcn / Radix primitive components (e.g. hover-card.tsx)
    ├── integrations/          # External library integrations
    │   └── tanstack-query/    # QueryClient provider & devtools
    └── lib/                   # Core business logic, schemas, and generators
        ├── schema.ts          # Zod schemas: Field, Index, EntityNode, RelationshipEdge, Workspace
        ├── field-types.ts     # SQL & Java field type definitions (VARCHAR, UUID, ENUM, etc.)
        ├── java-types.ts      # Type mappings, casing utils (toPascalCase, toSnakeCase, singularize)
        ├── relationship-types.ts # Relationship enum constants (MANY_TO_ONE, ONE_TO_MANY, etc.)
        ├── relationship-parser.ts# Edge parser creating JPA annotations (@ManyToOne, @OneToMany, etc.)
        ├── jpa-generator.ts   # Jakarta Persistence entity & enum code generator
        ├── ddl-generator.ts   # Flyway/Liquibase SQL DDL migration generator
        ├── project-exporter.ts# JSZip-based full Spring Boot Maven project builder
        ├── auto-layout.ts     # Dagre auto-layout positioning algorithm
        ├── error-handler.ts   # Sonner error notification handler
        └── utils.ts           # clsx + tailwind-merge helper (`cn`)
```

---

## 4. Key Workflows & Scripts

Run all commands using `pnpm`:

| Command | Purpose |
| :--- | :--- |
| `pnpm dev` | Start local Vite development server on port 3000 |
| `pnpm build` | Build the production application |
| `pnpm preview` | Preview production build locally |
| `pnpm generate-routes` | Regenerate TanStack Router route tree (`tsr generate`) |
| `pnpm test` | Run tests with Vitest (`vitest run`) |
| `pnpm lint` | Run ESLint across the codebase |
| `pnpm check` | Check formatting with Prettier |
| `pnpm format` | Auto-format files with Prettier & fix ESLint issues |
| `pnpm dlx shadcn@latest add <component>` | Add a new Shadcn UI component |

---

## 5. Development Guidelines & Best Practices for Agents

### Path Aliases & Imports

- Use `#/*` or `@/*` to import from `./src/*` (configured in `tsconfig.json` and `package.json`).
- Ensure TypeScript extensions follow `verbatimModuleSyntax` rules. Use `import type { ... }` when importing TypeScript types and interfaces.

### State Management & URL Sync

- **Do not introduce global client state that bypasses the URL**: The workspace canvas state must remain serializable into `WorkspaceSchema` (`src/lib/schema.ts`).
- Workspace mutations should go through `useWorkspace()` hook (`updateWorkspace`, `undo`, `redo`, `addEntity`, `cloneEntity`, `resetWorkspace`).
- Any new node attributes or field properties must be reflected in `src/lib/schema.ts` with sensible defaults to prevent breaking existing drafts.

### Code Generators (`src/lib/`)

- Generators (`jpa-generator.ts`, `ddl-generator.ts`, `relationship-parser.ts`) must remain **pure, stateless functions**.
- Always verify that generated Java classes:
  - Use `jakarta.persistence.*` (Spring Boot 3.x / 4.x standards).
  - Include appropriate imports, default constructors, and getter/setter pairs.
  - Handle nested/standalone enums correctly under the model package.
- Always verify that SQL DDL:
  - Generates valid SQL for PostgreSQL and MySQL dialects.
  - Includes foreign key constraints with matching column types.
  - Generates proper index statements.

### Styling & Design System

- Use **Tailwind CSS v4** classes.
- Follow the theme tokens defined in `src/styles.css` (`var(--java-orange)`, `var(--java-blue)`, `var(--bg-base)`, etc.).
- Ensure new UI components look polished in both **light** and **dark** modes.

### Route Generation

- If you add, delete, or rename files in `src/routes/`, run `pnpm generate-routes` (or `tsr generate`) to update `src/routeTree.gen.ts`. Never manually edit `routeTree.gen.ts`.

### OS / Environment Compatibility

- Note: `@cloudflare/vite-plugin` is conditionally activated only during `build` (`command === 'build'`) in `vite.config.ts` to prevent EOF pipe issues on Windows during local dev.

---

## 6. Common Tasks Quick-Reference

### Adding a New Data Type

1. Add the type name and configuration to `src/lib/field-types.ts`.
2. Map its Java type, SQL type, and necessary imports in `src/lib/java-types.ts`.
3. Update `src/lib/jpa-generator.ts` and `src/lib/ddl-generator.ts` if custom annotations or DDL syntax are needed.
4. Ensure the type appears in the field type dropdown inside `src/components/entity-node.tsx`.

### Adding a New Export Option or Supported Database

1. Update `ExportOptions` and `DB_CONFIG` in `src/lib/project-exporter.ts`.
2. Add the corresponding dialect, Maven dependencies in `generatePomXml()`, and properties in `generateDevProperties()` / `generateProdProperties()`.
3. Update the UI controls in `src/components/export-dialog.tsx`.
