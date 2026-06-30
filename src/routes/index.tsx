import { createFileRoute, Link } from '@tanstack/react-router'
import { ThemeToggle } from '#/components/theme-toggle'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="island-shell sticky top-0 z-50 flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-2">
          <img className='size-10' src="/header-logo.png" alt="logo/" />
          <span className="hidden md:block text-xl font-bold" style={{ color: 'var(--java-orange)' }}>
            EntityForge
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/workspace"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
            style={{
              backgroundColor: 'var(--java-orange)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--java-orange-deep)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--java-orange)')}
          >
            Open Workspace
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        <section className="page-wrap py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-block rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--java-orange)', borderColor: 'var(--java-orange)' }}>
              Visual Entity Designer
            </div>
            <h1 className="flex items-center justify-center gap-4 display-title text-4xl font-bold leading-tight md:text-6xl">
              <img className='size-30' src="/header-logo.png" alt="Logo" />
              <span style={{ color: 'var(--java-orange)' }} className='mt-5'>EntityForge</span>
            </h1>
            <h1 className='display-title text-2xl font-bold leading-tight md:text-4xl'>
              <br />
              Design Database Entities{' '}
              <span style={{ color: 'var(--java-blue)' }}>Visually</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: 'var(--java-muted)' }}>
              A drag-and-drop canvas to model JPA entities, define relationships, and
              export production-ready Java code and Flyway migrations — all in your
              browser, zero setup required.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4">
              <Link
                to="/workspace"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--java-orange)',
                  boxShadow: '0 4px 20px rgba(237, 139, 0, 0.35)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--java-orange-deep)'
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(237, 139, 0, 0.45)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--java-orange)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(237, 139, 0, 0.35)'
                }}
              >
                Start Building
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="page-wrap py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="display-title text-3xl font-bold md:text-4xl">
              Why EntityForge?
            </h2>
            <p className="mt-3" style={{ color: 'var(--java-muted)' }}>
              Everything you need to go from idea to database schema.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="feature-card rounded-2xl p-6">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgba(237, 139, 0, 0.12)' }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="var(--java-orange)" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Visual Canvas</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--java-muted)' }}>
                Drag-and-drop entities onto a React Flow canvas. Add fields, set
                primary keys, and connect relationships visually.
              </p>
            </div>
            <div className="feature-card rounded-2xl p-6">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgba(0, 115, 150, 0.12)' }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="var(--java-blue)" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Code Generation</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--java-muted)' }}>
                Instantly generate JPA entities with annotations, DDL for Flyway
                migrations, and a raw JSON schema of your model.
              </p>
            </div>
            <div className="feature-card rounded-2xl p-6">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgba(0, 115, 150, 0.12)' }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="var(--java-blue)" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">One-Click Export</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--java-muted)' }}>
                Package your entities and migrations into a Maven-ready ZIP file.
                Download and drop into your Spring Boot project.
              </p>
            </div>
          </div>
        </section>

        <section className="page-wrap py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="display-title text-3xl font-bold md:text-4xl">
              How It Works
            </h2>
            <p className="mt-3" style={{ color: 'var(--java-muted)' }}>
              Four simple steps from design to deployment.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              { step: '1', title: 'Design Entities', desc: 'Add entity nodes to the canvas. Name your table and configure fields with types and constraints.' },
              { step: '2', title: 'Map Relationships', desc: 'Drag edges between entities to define @OneToMany, @ManyToOne, and @OneToOne mappings.' },
              { step: '3', title: 'Preview Code', desc: 'Watch JPA entities, Flyway SQL, and JSON schema update in real time as you design.' },
              { step: '4', title: 'Export & Build', desc: 'Download a complete Maven project structure with entities and migrations, ready to compile.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ backgroundColor: 'var(--java-orange)' }}
                >
                  {step}
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--java-muted)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="page-wrap py-20">
          <div
            className="rounded-3xl px-8 py-16 text-center text-white md:px-16"
            style={{
              background: 'linear-gradient(135deg, var(--java-blue-deep), var(--duke-blue))',
            }}
          >
            <h2 className="display-title text-3xl font-bold md:text-4xl">
              Ready to Design Your Database?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed opacity-85">
              No account, no backend, no setup. Open the workspace and start
              modeling your entities in seconds.
            </p>
            <Link
              to="/workspace"
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--java-orange)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--java-orange-glow)'
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--java-orange)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.25)'
              }}
            >
              Open Workspace
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <footer className="site-footer px-6 py-8 text-center text-sm" style={{ color: 'var(--java-muted)' }}>
        <span className="font-bold" style={{ color: 'var(--java-orange)' }}>EntityForge</span>
        {' '}&mdash; 100% client-side. Built with React, React Flow, and TanStack.
      </footer>
    </div>
  )
}
