import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Box,
  Code2,
  Cpu,
  Database,
  Download,
  FileCode,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { Header } from '#/components/header'

import {
  EXAMPLES,
  LIFECYCLE_STEPS,
  type ExampleKey,
} from '#/lib/landing-constants'

export const Route = createFileRoute('/')({ component: Home })

function SampleClassAndCode() {
  const [selectedExample, setSelectedExample] = useState<ExampleKey>('customer')
  const [activeLang, setActiveLang] = useState<'java' | 'sql'>('java')

  const current = EXAMPLES[selectedExample]

  return (
    <div className="mx-auto mt-12 w-full max-w-5xl text-left">
      <div
        className="rounded-2xl border shadow-xl overflow-hidden backdrop-blur-md"
        style={{
          borderColor: 'var(--line)',
          backgroundColor: 'var(--surface-strong)',
        }}
      >
        {/* Main Toolbar / Tabs Header */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3"
          style={{
            borderColor: 'var(--line)',
            backgroundColor: 'var(--header-bg)',
          }}
        >
          {/* Entity Example Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="font-mono text-xs font-bold text-(--java-muted) mr-1.5 hidden sm:inline">
              Sample Entity:
            </span>
            {(['customer', 'order', 'product'] as const).map((key) => {
              const ex = EXAMPLES[key]
              const isSelected = selectedExample === key
              return (
                <button
                  key={key}
                  onClick={() => setSelectedExample(key)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-(--java-orange) text-white shadow-xs'
                      : 'text-(--java-muted) hover:text-(--java-dark) hover:bg-black/5 dark:hover:bg-white/5 border border-line'
                  }`}
                >
                  <div
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-xs text-[8px] font-bold ${
                      isSelected
                        ? 'bg-white text-(--java-orange)'
                        : 'bg-(--java-orange) text-white'
                    }`}
                  >
                    C
                  </div>
                  <span>{ex.name}.java</span>
                </button>
              )
            })}
          </div>

          {/* Language Output Selector */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-line">
            <button
              onClick={() => setActiveLang('java')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-all cursor-pointer ${
                activeLang === 'java'
                  ? 'bg-(--java-orange) text-white font-bold shadow-xs'
                  : 'text-(--java-muted) hover:text-(--java-dark)'
              }`}
            >
              <span>Java JPA</span>
            </button>
            <button
              onClick={() => setActiveLang('sql')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-all cursor-pointer ${
                activeLang === 'sql'
                  ? 'bg-(--java-blue) text-white font-bold shadow-xs'
                  : 'text-(--java-muted) hover:text-(--java-dark)'
              }`}
            >
              <span>Flyway SQL</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Visual Class Model (Left) & Equivalent Code (Right) */}
        <div
          className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x"
          style={{ borderColor: 'var(--line)' }}
        >
          {/* Left Column: Visual OOP Class Diagram Card + Architecture Details */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-(--bg-base)/60 text-left flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-(--java-muted) mb-3">
                <span>// Visual Class Model</span>
                <span className="text-[10px] text-(--java-orange)">
                  Canvas Node
                </span>
              </div>

              {/* UML Entity Node */}
              <div className="rounded-xl border-2 border-(--line) shadow-md overflow-hidden bg-(--java-cream)">
                {/* Class Header */}
                <div
                  className="px-4 py-3 text-white"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--java-orange), var(--java-orange-deep))',
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/80 mb-1">
                    <span>@Entity @Table(name = "{current.tableName}")</span>
                    <span className="rounded bg-black/20 px-1.5 py-0.2">
                      {current.badgeLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[11px] font-extrabold text-(--java-orange)">
                      C
                    </div>
                    <span className="font-mono text-sm font-bold text-white">
                      {current.name}
                    </span>
                  </div>
                </div>

                {/* Attributes Compartment */}
                <div className="divide-y divide-line font-mono text-xs text-left">
                  {current.fields.map((field, idx) => (
                    <div
                      key={field.name}
                      className={`flex items-center justify-between px-3 py-2 ${
                        idx % 2 === 0 ? 'bg-black/2 dark:bg-white/2' : ''
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-rose-500 font-bold">-</span>
                        <span className="text-(--java-blue) font-semibold">
                          {field.type}
                        </span>
                        <span className="font-semibold text-(--java-dark)">
                          {field.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {field.badges.map((b) => (
                          <span
                            key={b.label}
                            className="rounded px-1.5 py-0.5 text-[9px] font-bold"
                            style={{
                              color: b.color,
                              backgroundColor: b.bg || 'rgba(0, 0, 0, 0.05)',
                            }}
                          >
                            {b.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Indexes Compartment */}
                {current.indexes.length > 0 && (
                  <div className="border-t border-line px-3 py-2 bg-black/5 dark:bg-white/5 font-mono text-[10px] text-left">
                    {current.indexes.map((idx) => (
                      <div
                        key={idx.name}
                        className="flex items-center justify-between text-(--java-muted)"
                      >
                        <span>
                          @Index:{' '}
                          <strong className="text-(--java-dark)">
                            {idx.name}
                          </strong>
                        </span>
                        {idx.unique && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            UNIQUE
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Architectural Pattern Summary Card (Fills extra vertical space) */}
              <div className="mt-4 rounded-xl border border-line p-3.5 bg-black/5 dark:bg-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-(--java-dark)">
                    {current.patternTitle}
                  </span>
                  <span className="java-chip text-[9px] py-0.5 px-1.5 text-(--java-muted)">
                    Architecture
                  </span>
                </div>
                <p className="text-xs text-(--java-muted) leading-relaxed m-0">
                  {current.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {current.highlights.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-black/10 dark:bg-white/10 px-2 py-0.5 font-mono text-[10px] text-(--java-muted)"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Link to Studio */}
            <div className="pt-2 border-t border-line flex items-center justify-between">
              <Link
                to="/workspace"
                className="flex items-center gap-1.5 font-mono text-xs font-bold text-(--java-orange) hover:underline"
              >
                <span>Design on Canvas</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <span className="text-[11px] font-mono text-(--java-muted)">
                Instant Spring Initializr
              </span>
            </div>
          </div>

          {/* Right Column: Equivalent Generated Code */}
          <div className="lg:col-span-7 bg-[#161519] dark:bg-[#0e0d10] p-5 sm:p-6 text-left overflow-x-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800 font-mono text-[11px] text-gray-400">
              <span className="text-amber-400 font-semibold truncate">
                {activeLang === 'java' ? current.javaFile : current.sqlFile}
              </span>
              <span className="text-gray-500 uppercase shrink-0 ml-2">
                {activeLang}
              </span>
            </div>

            {activeLang === 'java' ? current.javaCode : current.sqlCode}
          </div>
        </div>
      </div>
    </div>
  )
}

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="page-wrap relative pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* Main Brand Logo */}
            <div className="mb-6 flex justify-center">
              <img
                src="/header-logo.png"
                alt="EntityForge"
                className="h-20 w-auto sm:h-30 md:h-40 transition-transform duration-300 hover:scale-105"
              />
            </div>

            <h1
              className="display-title text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.12]"
              style={{ color: 'var(--java-dark)' }}
            >
              Visual Entity Modeling for{' '}
              <span style={{ color: 'var(--java-orange)' }}>Spring Boot</span>
            </h1>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/workspace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background:
                    'linear-gradient(135deg, var(--java-orange), var(--java-orange-deep))',
                }}
              >
                <Code2 className="size-4" />
                <span>Launch Workspace</span>
              </Link>
              <Link
                to="/documentation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-line px-6 py-3 text-sm font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/5"
                style={{
                  backgroundColor: 'var(--surface)',
                  color: 'var(--java-dark)',
                }}
              >
                <FileCode className="size-4 text-(--java-blue)" />
                <span>Documentation</span>
              </Link>
            </div>
          </div>

          {/* Interactive Multi-Entity Tabbed Code Showcase */}
          <SampleClassAndCode />
        </section>

        {/* 4 OOP Pillars Section */}
        <section
          className="page-wrap py-14 sm:py-20 border-t"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="mx-auto max-w-3xl text-center px-4">
            <div className="island-kicker">Core Java Architecture</div>
            <h2 className="display-title mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">
              Engineered with Object-Oriented Principles
            </h2>
            <p
              className="mt-3 text-xs sm:text-sm md:text-base"
              style={{ color: 'var(--java-muted)' }}
            >
              EntityForge brings modern Java domain-driven design into an
              intuitive visual graph.
            </p>
          </div>

          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="feature-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
              <div className="mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-(--java-orange)/10 text-(--java-orange)">
                <Box className="size-5 sm:size-6" />
              </div>
              <div className="font-mono text-xs text-(--java-orange) font-semibold">
                @Entity & Properties
              </div>
              <h3 className="mt-1 text-base font-bold">Encapsulation</h3>
              <p
                className="mt-2 text-xs leading-relaxed"
                style={{ color: 'var(--java-muted)' }}
              >
                Declare strongly-typed fields (`UUID`, `Instant`, `BigDecimal`,
                Enums) with strict constraints (`PK`, `Unique`, `Nullable`) and
                auto-generated Java accessors.
              </p>
            </div>

            <div className="feature-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
              <div className="mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-(--java-blue)/10 text-(--java-blue)">
                <Workflow className="size-5 sm:size-6" />
              </div>
              <div className="font-mono text-xs text-(--java-blue) font-semibold">
                @ManyToOne / @OneToMany
              </div>
              <h3 className="mt-1 text-base font-bold">Object Associations</h3>
              <p
                className="mt-2 text-xs leading-relaxed"
                style={{ color: 'var(--java-muted)' }}
              >
                Visually connect entities with UML-style relationships (`1:N`,
                `N:1`, `1:1`, `M:M`), automatic `@JoinColumn` injection, and
                collection mapping.
              </p>
            </div>

            <div className="feature-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
              <div className="mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-(--spring-green)/10 text-(--spring-green)">
                <Database className="size-5 sm:size-6" />
              </div>
              <div className="font-mono text-xs text-(--spring-green) font-semibold">
                @Index & Flyway DDL
              </div>
              <h3 className="mt-1 text-base font-bold">Schema Persistence</h3>
              <p
                className="mt-2 text-xs leading-relaxed"
                style={{ color: 'var(--java-muted)' }}
              >
                Transform class diagrams into pure, dialect-specific SQL
                migrations (`CREATE TABLE`, foreign key constraints, composite
                indexes) for PostgreSQL & MySQL.
              </p>
            </div>

            <div className="feature-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
              <div className="mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-(--java-orange-glow)/10 text-(--java-orange-deep)">
                <Download className="size-5 sm:size-6" />
              </div>
              <div className="font-mono text-xs text-(--java-orange-deep) font-semibold">
                pom.xml + Maven Wrapper
              </div>
              <h3 className="mt-1 text-base font-bold">Maven ZIP Builder</h3>
              <p
                className="mt-2 text-xs leading-relaxed"
                style={{ color: 'var(--java-muted)' }}
              >
                Export a ready-to-run Spring Boot Maven project complete with
                `mvnw`, tests, configuration profiles
                (`application-dev.properties`), and models in one click.
              </p>
            </div>
          </div>
        </section>

        {/* The 4-Step Java Lifecycle */}
        <section
          className="page-wrap py-14 sm:py-20 border-t"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="mx-auto max-w-2xl text-center px-4">
            <div className="island-kicker">Execution Lifecycle</div>
            <h2 className="display-title mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">
              From Visual Diagram to Running Microservice
            </h2>
          </div>
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {LIFECYCLE_STEPS.map(({ step, title, badge, desc }) => (
              <div
                key={step}
                className="java-class-card p-5 sm:p-6 relative group transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl sm:text-2xl font-extrabold font-mono text-(--java-orange)">
                    {step}
                  </span>
                  <span className="java-chip text-[10px] text-(--java-muted)">
                    {badge}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold mb-2">{title}</h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--java-muted)' }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Terminal Banner */}
        <section className="page-wrap py-10 sm:py-16">
          <div
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 text-white shadow-2xl relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, var(--duke-blue), var(--java-blue-deep))',
            }}
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="text-left max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 font-mono text-xs font-semibold backdrop-blur-md">
                  <Cpu className="size-3.5 text-(--java-orange-glow)" />
                  <span>Spring Boot 4.x / 3.x Ready</span>
                </div>
                <h2 className="display-title mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                  Instantiate Your JPA Domain Model Now
                </h2>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-white/80 leading-relaxed">
                  No sign-up, zero server delays, completely secure and private
                  in your browser.
                </p>
              </div>

              <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                <Link
                  to="/workspace"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 sm:px-8 sm:py-4 text-sm font-bold text-(--duke-blue) shadow-lg transition-all hover:bg-amber-300 hover:scale-105"
                  style={{
                    backgroundColor: 'var(--java-orange-glow)',
                  }}
                >
                  <Sparkles className="size-4" />
                  <span>Launch Workspace</span>
                  <ArrowRight className="size-4" />
                </Link>
                <span className="text-center font-mono text-[10px] sm:text-[11px] text-white/60">
                  URL-synced • Full Undo/Redo • JSZip Export
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        className="site-footer px-6 py-8 text-center text-xs"
        style={{ color: 'var(--java-muted)' }}
      >
        <div className="page-wrap flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-(--java-orange)">EntityForge</span>
            <span>&mdash; Java OOP Visual Entity Studio</span>
          </div>
          <div className="font-mono text-[11px]">
            100% Client-Side • Built with React 19, TanStack & React Flow
          </div>
        </div>
      </footer>
    </div>
  )
}
