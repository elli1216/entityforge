import { createFileRoute } from '@tanstack/react-router'
import {
  BookOpen,
  Box,
  Database,
  Download,
  Key,
  Layers,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { Header } from '#/components/header'

export const Route = createFileRoute('/documentation')({
  component: DocumentationPage,
})

function DocumentationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Main Content */}
      <div className="page-wrap flex flex-1 items-start gap-8 py-6 sm:py-10">
        {/* Desktop Sidebar Nav */}
        <aside className="sticky top-20 hidden w-72 shrink-0 flex-col gap-6 lg:flex">
          <div className="island-shell rounded-2xl p-5 border shadow-sm" style={{ borderColor: 'var(--line)' }}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="size-4 text-(--java-orange)" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-(--java-muted)">
                JPA OOP Handbook
              </h3>
            </div>
            <div className="font-mono text-[10px] text-(--java-muted) pb-3 mb-3 border-b border-line">
              package com.entityforge.docs;
            </div>
            <ul className="flex flex-col gap-1.5 text-xs font-medium">
              <li>
                <a href="#introduction" className="nav-link flex items-center gap-2 py-1">
                  <span className="font-mono text-[10px] text-(--java-orange)">01.</span>
                  <span>Architecture & Overview</span>
                </a>
              </li>
              <li>
                <a href="#canvas" className="nav-link flex items-center gap-2 py-1">
                  <span className="font-mono text-[10px] text-(--java-orange)">02.</span>
                  <span>Visual Canvas Studio</span>
                </a>
              </li>
              <li>
                <a href="#entities" className="nav-link flex items-center gap-2 py-1">
                  <span className="font-mono text-[10px] text-(--java-orange)">03.</span>
                  <span>@Entity & Properties</span>
                </a>
              </li>
              <li>
                <a href="#relationships" className="nav-link flex items-center gap-2 py-1">
                  <span className="font-mono text-[10px] text-(--java-orange)">04.</span>
                  <span>OOP Associations (1:N, N:1, M:M)</span>
                </a>
              </li>
              <li>
                <a href="#indexes" className="nav-link flex items-center gap-2 py-1">
                  <span className="font-mono text-[10px] text-(--java-orange)">05.</span>
                  <span>@Index & Dialects</span>
                </a>
              </li>
              <li>
                <a href="#exporting" className="nav-link flex items-center gap-2 py-1">
                  <span className="font-mono text-[10px] text-(--java-orange)">06.</span>
                  <span>Spring Boot Maven Exporter</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="java-class-card p-4 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-(--java-orange) mb-1.5">
              <Sparkles className="size-3.5" />
              <span>Developer Quick Tip</span>
            </div>
            <p className="text-[11px] leading-relaxed text-(--java-muted)">
              All entity modifications generate immutable, type-safe URL drafts. Bookmark or share your URL to reload the exact schema instantly.
            </p>
          </div>
        </aside>

        {/* Article Content */}
        <main className="island-shell w-full max-w-3xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 lg:min-w-0 border shadow-md" style={{ borderColor: 'var(--line)' }}>
          {/* Mobile Quick Chapter Jump */}
          <div className="lg:hidden mb-6 rounded-xl border border-line p-3 bg-black/5 dark:bg-white/5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-(--java-orange) mb-2">
              <BookOpen className="size-3.5" />
              <span>Jump to Section:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
              <a href="#introduction" className="rounded bg-black/5 dark:bg-white/10 px-2 py-1 text-(--java-muted) hover:text-(--java-dark)">01. Overview</a>
              <a href="#canvas" className="rounded bg-black/5 dark:bg-white/10 px-2 py-1 text-(--java-muted) hover:text-(--java-dark)">02. Canvas</a>
              <a href="#entities" className="rounded bg-black/5 dark:bg-white/10 px-2 py-1 text-(--java-muted) hover:text-(--java-dark)">03. @Entity</a>
              <a href="#relationships" className="rounded bg-black/5 dark:bg-white/10 px-2 py-1 text-(--java-muted) hover:text-(--java-dark)">04. Associations</a>
              <a href="#indexes" className="rounded bg-black/5 dark:bg-white/10 px-2 py-1 text-(--java-muted) hover:text-(--java-dark)">05. Indexes</a>
              <a href="#exporting" className="rounded bg-black/5 dark:bg-white/10 px-2 py-1 text-(--java-muted) hover:text-(--java-dark)">06. Maven ZIP</a>
            </div>
          </div>

          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-a:text-java-blue hover:prose-a:text-java-blue-deep">
            {/* Package path banner */}
            <div className="inline-flex items-center gap-2 rounded-md bg-(--oop-badge-bg) px-3 py-1 font-mono text-xs font-semibold text-(--java-orange) border border-(--oop-badge-border)">
              <span>package com.entityforge.specification;</span>
            </div>

            <h1 id="introduction" className="display-title text-2xl sm:text-3xl md:text-4xl mt-4" style={{ color: 'var(--java-dark)' }}>
              Java OOP Entity Modeling Handbook
            </h1>
            <p className="lead text-sm sm:text-base md:text-lg" style={{ color: 'var(--java-muted)' }}>
              EntityForge is a zero-latency, in-browser visual workbench designed to bridge the gap between Object-Oriented Domain Models in Java (Spring Data JPA / Jakarta EE) and Relational Database Schemas (PostgreSQL & MySQL).
            </p>

            <hr style={{ borderColor: 'var(--line)' }} className="my-8" />

            <h2 id="canvas" className="display-title flex items-center gap-2.5 text-xl sm:text-2xl font-bold" style={{ color: 'var(--java-dark)' }}>
              <Layers className="size-5 sm:size-6 text-(--java-orange)" />
              01. The Visual Canvas Studio
            </h2>
            <p>
              The workspace is powered by React Flow with custom directed graph nodes representing Java classes. The canvas executes 100% inside your client:
            </p>
            <ul>
              <li><strong>Zero Remote Roundtrips:</strong> Schema changes immediately serialize to the browser URL (`/workspace?draft=...`) and localStorage (`current_draft`).</li>
              <li><strong>Full Undo/Redo Engine:</strong> Built-in 50-state history stack accessible via <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">Ctrl+Z</kbd> and <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">Ctrl+Y</kbd>.</li>
              <li><strong>Directed Dagre Auto-Layout:</strong> One-click algorithmic reorganization of entity nodes to keep complex relational graphs orderly.</li>
            </ul>

            <h2 id="entities" className="display-title flex items-center gap-2.5 mt-12 text-2xl font-bold" style={{ color: 'var(--java-dark)' }}>
              <Box className="size-6 text-(--java-blue)" />
              02. @Entity & Property Encapsulation
            </h2>
            <p>
              Each node on the canvas corresponds to a single Java class annotated with <code>@Entity</code> and mapped to a database table via <code>@Table(name = "...")</code>.
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full text-xs font-mono border" style={{ borderColor: 'var(--line)' }}>
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 border-b" style={{ borderColor: 'var(--line)' }}>
                    <th className="p-2 text-left">Canvas Field Type</th>
                    <th className="p-2 text-left">Java / Jakarta Type</th>
                    <th className="p-2 text-left">SQL DDL Type</th>
                    <th className="p-2 text-left">JPA Mapping Annotations</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--line)' }}>
                  <tr>
                    <td className="p-2 font-bold text-(--java-orange)">UUID</td>
                    <td className="p-2 text-(--java-blue)">java.util.UUID</td>
                    <td className="p-2">UUID</td>
                    <td className="p-2">@Id @GeneratedValue(strategy = GenerationType.UUID)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-(--java-orange)">VARCHAR</td>
                    <td className="p-2 text-(--java-blue)">String</td>
                    <td className="p-2">VARCHAR(n)</td>
                    <td className="p-2">@Column(length = n, nullable = ...)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-(--java-orange)">DECIMAL</td>
                    <td className="p-2 text-(--java-blue)">BigDecimal</td>
                    <td className="p-2">DECIMAL(p, s)</td>
                    <td className="p-2">@Column(precision = p, scale = s)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-(--java-orange)">ENUM</td>
                    <td className="p-2 text-(--java-blue)">Custom Enum</td>
                    <td className="p-2">VARCHAR(255)</td>
                    <td className="p-2">@Enumerated(EnumType.STRING)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-(--java-orange)">TIMESTAMP</td>
                    <td className="p-2 text-(--java-blue)">Instant / LocalDateTime</td>
                    <td className="p-2">TIMESTAMP WITH TIME ZONE</td>
                    <td className="p-2">@Column(name = "...")</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border p-4 my-6" style={{ borderColor: 'var(--oop-badge-border)', background: 'var(--oop-badge-bg)' }}>
              <div className="flex items-center gap-2 font-bold text-xs text-(--java-orange) mb-1">
                <Key className="size-4" />
                <span>Encapsulation & Modifiers</span>
              </div>
              <p className="m-0 text-xs text-(--java-muted) leading-relaxed">
                Toggle <strong>PK</strong> for Primary Key, <strong>NL</strong> for NOT NULL / non-nullable constraints, and <strong>UN</strong> for UNIQUE columns. EntityForge automatically generates standard Java default constructors and JavaBean getters and setters.
              </p>
            </div>

            <h2 id="relationships" className="display-title flex items-center gap-2.5 mt-12 text-2xl font-bold" style={{ color: 'var(--java-dark)' }}>
              <Workflow className="size-6 text-(--spring-green)" />
              03. Object-Oriented Associations & Mappings
            </h2>
            <p>
              Connect entities by dragging from the <strong>Orange Outbound Handle (Right)</strong> of the source entity to the <strong>Blue Inbound Handle (Left)</strong> of the target entity.
            </p>

            <div className="space-y-4 my-6">
              <div className="java-class-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-(--java-orange)">Many-To-One (@ManyToOne) [Default]</span>
                  <span className="java-chip text-[10px]">Owning Side</span>
                </div>
                <p className="text-xs text-(--java-muted) m-0">
                  Injects <code>@ManyToOne(fetch = FetchType.LAZY)</code> and <code>@JoinColumn(name = "..._id")</code> on the source entity, and a bidirectional <code>@OneToMany(mappedBy = "...", cascade = CascadeType.ALL)</code> collection on the target entity.
                </p>
              </div>

              <div className="java-class-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-(--java-blue)">Many-To-Many (@ManyToMany)</span>
                  <span className="java-chip text-[10px]">Join Table</span>
                </div>
                <p className="text-xs text-(--java-muted) m-0">
                  Creates a dedicated <code>@JoinTable(name = "a_b")</code> join table linking foreign keys with matching unique column definitions.
                </p>
              </div>
            </div>

            <h2 id="indexes" className="display-title flex items-center gap-2.5 mt-12 text-2xl font-bold" style={{ color: 'var(--java-dark)' }}>
              <Database className="size-6 text-(--java-blue-soft)" />
              04. Composite @Index & Database Dialects
            </h2>
            <p>
              Add multi-column or single-column indexes on any entity node by clicking <strong>+ Index</strong>. Indexes are declared directly inside the entity's <code>@Table(indexes = &#123; @Index(...) &#125;)</code> annotation and emitted as standard <code>CREATE [UNIQUE] INDEX</code> statements in your Flyway SQL script.
            </p>

            <h2 id="exporting" className="display-title flex items-center gap-2.5 mt-12 text-2xl font-bold" style={{ color: 'var(--java-dark)' }}>
              <Download className="size-6 text-(--java-orange)" />
              05. Spring Boot Project Archive Generator
            </h2>
            <p>
              When your schema design is ready, click <strong>Export</strong> in the top bar. EntityForge will assemble an in-memory Maven project ZIP:
            </p>
            <ul>
              <li><strong>`pom.xml`:</strong> Pre-configured with Spring Boot 3.x/4.x starters, Flyway, PostgreSQL/MySQL drivers, and test frameworks.</li>
              <li><strong>Maven Wrapper:</strong> Bundled `mvnw` and `mvnw.cmd` scripts for instant zero-config builds.</li>
              <li><strong>`application.properties`:</strong> Configured with dev and prod profiles (`application-dev.properties` with optional in-memory H2 support).</li>
              <li><strong>`src/main/java/.../models/`:</strong> Fully annotated JPA entities and enum declarations.</li>
              <li><strong>`src/main/resources/db/migration/`:</strong> Numbered Flyway migration scripts (`V1__create_initial_schema.sql`).</li>
            </ul>
          </article>
        </main>
      </div>

      <footer className="site-footer mt-auto py-8">
        <div className="page-wrap flex flex-col sm:flex-row items-center justify-between text-xs" style={{ color: 'var(--java-muted)' }}>
          <div>© {new Date().getFullYear()} EntityForge. Object-Oriented JPA Domain Modeling.</div>
          <div className="font-mono text-[11px]">Pure Client-Side Data Pipeline</div>
        </div>
      </footer>
    </div>
  )
}

