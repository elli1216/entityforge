import { createFileRoute } from '@tanstack/react-router'
import { Database, FileCode2, Layers } from 'lucide-react'

import { Header } from '#/components/header'

export const Route = createFileRoute('/documentation')({
  component: DocumentationPage,
})

function DocumentationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Main Content */}
      <div className="page-wrap flex flex-1 items-start gap-8 py-10">

        {/* Sidebar Nav */}
        <aside className="sticky top-28 hidden w-64 shrink-0 flex-col gap-6 lg:flex">
          <div className="island-shell rounded-2xl p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--java-muted)' }}>On This Page</h3>
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li><a href="#introduction" className="nav-link inline-block pb-1">Introduction</a></li>
              <li><a href="#canvas" className="nav-link inline-block pb-1">The Canvas</a></li>
              <li><a href="#entities" className="nav-link inline-block pb-1">Entities & Fields</a></li>
              <li><a href="#relationships" className="nav-link inline-block pb-1">Relationships</a></li>
              <li><a href="#indexes" className="nav-link inline-block pb-1">Indexes</a></li>
              <li><a href="#exporting" className="nav-link inline-block pb-1">Exporting Code</a></li>
            </ul>
          </div>
        </aside>

        {/* Article Content */}
        <main className="island-shell w-full max-w-3xl rounded-3xl p-8 sm:p-12 lg:min-w-0">
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-fraunces prose-a:text-java-blue hover:prose-a:text-java-blue-deep">

            <h1 id="introduction" className="display-title text-4xl" style={{ color: 'var(--java-dark)' }}>Documentation</h1>
            <p className="lead text-lg" style={{ color: 'var(--java-muted)' }}>
              EntityForge is a zero-latency, visual schema builder that lets you drag-and-drop database entities and instantly generates production-ready Spring Boot JPA code and Flyway DDL scripts.
            </p>

            <hr style={{ borderColor: 'var(--line)' }} className="my-8" />

            <h2 id="canvas" className="display-title flex items-center gap-2" style={{ color: 'var(--java-dark)' }}>
              <Layers className="h-6 w-6" style={{ color: 'var(--java-orange)' }} />
              The Canvas
            </h2>
            <p>
              The workspace canvas is your primary interface. It is a completely client-side interactive diagramting tool built using React Flow.
            </p>
            <ul>
              <li><strong>Zero Latency:</strong> All data is stored in your browser's URL and localStorage. There are no loading spinners or database saves.</li>
              <li><strong>Panning & Zooming:</strong> Click and drag the background to pan. Scroll to zoom in and out.</li>
              <li><strong>Auto-Layout:</strong> If your diagram gets messy, click the <em>Layout Nodes</em> button in the toolbar to automatically arrange your entities using the Dagre layout engine.</li>
            </ul>

            <h2 id="entities" className="display-title flex items-center gap-2 mt-12" style={{ color: 'var(--java-dark)' }}>
              <Database className="h-6 w-6" style={{ color: 'var(--java-blue)' }} />
              Entities & Fields
            </h2>
            <p>
              An entity represents a single database table (and Java Class). Right-click on the canvas or use the toolbar to add a new entity.
            </p>
            <h3>Adding Fields</h3>
            <p>
              Click <strong>+ Field</strong> at the bottom of an entity to add a new column. You can configure:
            </p>
            <ul>
              <li><strong>Name:</strong> The column name (e.g., <code>first_name</code>).</li>
              <li><strong>Type:</strong> Choose from standard SQL/Java types like <code>VARCHAR</code>, <code>INTEGER</code>, <code>ENUM</code>, etc.</li>
              <li><strong>Modifiers:</strong> Toggle badges for Primary Key (<strong>PK</strong>), Not Null (<strong>NL</strong>), and Unique (<strong>UN</strong>).</li>
            </ul>
            <div className="rounded-xl border p-4 bg-opacity-50" style={{ borderColor: 'var(--line)', background: 'var(--java-warm)' }}>
              <p className="m-0 text-sm font-semibold" style={{ color: 'var(--java-orange-deep)' }}>Pro Tip: Reordering</p>
              <p className="m-0 mt-1 text-sm text-muted-foreground">You can use the Up/Down arrows next to a field to reorder them visually in the table.</p>
            </div>

            <h2 id="relationships" className="display-title mt-12" style={{ color: 'var(--java-dark)' }}>Relationships</h2>
            <p>
              Connect entities by dragging a line from the orange handle (Right) of one entity to the blue handle (Left) of another entity.
            </p>
            <p>
              By default, this creates a <strong>Many-To-One</strong> relationship. Click on the edge (the connecting line) to select it, and press backspace or use the toolbar to delete it.
            </p>

            <h2 id="indexes" className="display-title mt-12" style={{ color: 'var(--java-dark)' }}>Indexes</h2>
            <p>
              To improve database query performance or enforce uniqueness across multiple columns, you can add Indexes.
            </p>
            <ol>
              <li>Click <strong>+ Index</strong> on the bottom right of an entity.</li>
              <li>Provide an index name (e.g., <code>idx_user_email</code>).</li>
              <li>Type the column names as a comma-separated list (e.g., <code>email, department</code>).</li>
              <li>Toggle the <strong>UN</strong> (Unique) badge if the database should enforce unique constraints for these combined columns.</li>
            </ol>

            <h2 id="exporting" className="display-title flex items-center gap-2 mt-12" style={{ color: 'var(--java-dark)' }}>
              <FileCode2 className="h-6 w-6" style={{ color: 'var(--java-blue-soft)' }} />
              Exporting Code
            </h2>
            <p>
              EntityForge generates code in real-time. You can view the live output in the tabbed panel at the bottom of the workspace.
            </p>
            <ul>
              <li><strong>JPA Entities:</strong> Fully annotated Java classes ready for Spring Boot.</li>
              <li><strong>Flyway SQL:</strong> Standard DDL statements (<code>CREATE TABLE</code>, <code>ALTER TABLE</code>) for database migrations.</li>
              <li><strong>State JSON:</strong> The raw schema state for debugging.</li>
            </ul>
            <p>
              When you're ready, click the <strong>Export Zip</strong> button in the bottom right. This generates a complete Maven project structure containing all your domain classes and migration scripts.
            </p>

          </article>
        </main>
      </div>

      <footer className="site-footer mt-auto py-8">
        <div className="page-wrap text-center text-sm" style={{ color: 'var(--java-muted)' }}>
          <p>© {new Date().getFullYear()} EntityForge. Built with React and TanStack.</p>
        </div>
      </footer>
    </div>
  )
}
