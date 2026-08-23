import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  FileCode,
  Layers,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react'
import { Header } from '#/components/header'

export const Route = createFileRoute('/')({ component: Home })

function SampleClassAndCode() {
  const [activeTab, setActiveTab] = useState<'java' | 'sql'>('java')

  return (
    <div className="mx-auto mt-14 w-full max-w-5xl text-left">
      <div
        className="rounded-2xl border shadow-xl overflow-hidden backdrop-blur-md"
        style={{
          borderColor: 'var(--line)',
          backgroundColor: 'var(--surface-strong)',
        }}
      >
        {/* Header Bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3"
          style={{
            borderColor: 'var(--line)',
            backgroundColor: 'var(--header-bg)',
          }}
        >
          <div className="flex items-center gap-2 font-mono text-xs text-(--java-muted)">
            <Code2 className="size-4 text-(--java-orange)" />
            <span className="font-semibold text-(--java-dark)">
              Visual Entity Model
            </span>
            <span className="text-gray-400">→</span>
            <span className="font-semibold text-(--java-blue)">
              Generated Production Code
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('java')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === 'java'
                  ? 'bg-(--java-orange) text-white font-bold shadow-xs'
                  : 'text-(--java-muted) hover:text-(--java-dark) hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span>Customer.java</span>
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-(--java-blue) text-white font-bold shadow-xs'
                  : 'text-(--java-muted) hover:text-(--java-dark) hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span>V1__create_customers.sql</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Visual Class Model (Left) & Equivalent Code (Right) */}
        <div
          className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x"
          style={{ borderColor: 'var(--line)' }}
        >
          {/* Left Column: Visual OOP Class Diagram Card */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-(--bg-base)/60 text-left">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-(--java-muted) mb-3">
              // Canvas Entity Node
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
                  <span>@Entity @Table(name = "customers")</span>
                  <span className="rounded bg-black/20 px-1.5 py-0.2">
                    JPA Model
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[11px] font-extrabold text-(--java-orange)">
                    C
                  </div>
                  <span className="font-mono text-sm font-bold text-white">
                    Customer
                  </span>
                </div>
              </div>

              {/* Attributes Compartment */}
              <div className="divide-y divide-line font-mono text-xs text-left">
                <div className="flex items-center justify-between px-3 py-2 bg-black/2 dark:bg-white/2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-500 font-bold">-</span>
                    <span className="text-(--java-blue) font-semibold">
                      UUID
                    </span>
                    <span className="font-semibold text-(--java-dark)">id</span>
                  </div>
                  <span className="rounded bg-(--java-orange)/20 px-1.5 py-0.5 text-[9px] font-bold text-(--java-orange)">
                    @Id PK
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-500 font-bold">-</span>
                    <span className="text-(--java-blue) font-semibold">
                      String
                    </span>
                    <span className="font-semibold text-(--java-dark)">
                      email
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold">
                    <span className="rounded bg-(--java-blue)/20 px-1.5 py-0.5 text-(--java-blue)">
                      NN
                    </span>
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-600 dark:text-amber-400">
                      UN
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 py-2 bg-black/2 dark:bg-white/2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-500 font-bold">-</span>
                    <span className="text-(--java-blue) font-semibold">
                      String
                    </span>
                    <span className="font-semibold text-(--java-dark)">
                      fullName
                    </span>
                  </div>
                  <span className="rounded bg-(--java-blue)/20 px-1.5 py-0.5 text-[9px] font-bold text-(--java-blue)">
                    NN
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-500 font-bold">-</span>
                    <span className="text-(--java-orange-deep) font-semibold">
                      CustomerTier
                    </span>
                    <span className="font-semibold text-(--java-dark)">
                      tier
                    </span>
                  </div>
                  <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-600 dark:text-purple-400">
                    ENUM
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 bg-black/2 dark:bg-white/2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-500 font-bold">-</span>
                    <span className="text-(--spring-green) font-semibold">
                      List&lt;Order&gt;
                    </span>
                    <span className="font-semibold text-(--java-dark)">
                      orders
                    </span>
                  </div>
                  <span className="rounded bg-(--spring-green)/20 px-1.5 py-0.5 text-[9px] font-bold text-(--spring-green)">
                    @OneToMany
                  </span>
                </div>
              </div>

              {/* Indexes Compartment */}
              <div className="border-t border-line px-3 py-2 bg-black/5 dark:bg-white/5 font-mono text-[10px] text-left">
                <div className="flex items-center justify-between text-(--java-muted)">
                  <span>
                    @Index:{' '}
                    <strong className="text-(--java-dark)">
                      idx_customer_email
                    </strong>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    UNIQUE
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-(--java-muted)">
              <span>⚡ Drag-and-drop handles</span>
              <span>↻ Live 2-way sync</span>
            </div>
          </div>

          {/* Right Column: Equivalent Generated Code (Left-aligned) */}
          <div className="lg:col-span-7 bg-[#161519] dark:bg-[#0e0d10] p-5 sm:p-6 text-left overflow-x-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800 font-mono text-[11px] text-gray-400">
              <span className="text-amber-400 font-semibold">
                {activeTab === 'java'
                  ? 'src/main/java/com/entityforge/domain/models/Customer.java'
                  : 'src/main/resources/db/migration/V1__create_customers.sql'}
              </span>
              <span className="text-gray-500 uppercase">{activeTab}</span>
            </div>

            {activeTab === 'java' ? (
              <pre className="font-mono text-xs leading-relaxed text-gray-200 text-left whitespace-pre m-0">
                <span className="text-purple-400">package</span>{' '}
                com.entityforge.domain.models;{'\n\n'}
                <span className="text-purple-400">import</span>{' '}
                jakarta.persistence.*;{'\n'}
                <span className="text-purple-400">import</span>{' '}
                java.io.Serializable;{'\n'}
                <span className="text-purple-400">import</span> java.util.*;
                {'\n\n'}
                <span className="text-amber-400">@Entity</span>
                {'\n'}
                <span className="text-amber-400">@Table</span>(name ={' '}
                <span className="text-emerald-400">"customers"</span>, indexes ={' '}
                {'{'}
                {'\n'}
                {'    '}
                <span className="text-amber-400">@Index</span>(name ={' '}
                <span className="text-emerald-400">"idx_customer_email"</span>,
                columnList = <span className="text-emerald-400">"email"</span>,
                unique = <span className="text-purple-400">true</span>){'\n'}
                {'}'}){'\n'}
                <span className="text-purple-400">public class</span>{' '}
                <span className="text-sky-300 font-bold">Customer</span>{' '}
                <span className="text-purple-400">implements</span> Serializable{' '}
                {'{\n\n'}
                {'    '}
                <span className="text-amber-400">@Id</span>
                {'\n'}
                {'    '}
                <span className="text-amber-400">@GeneratedValue</span>(strategy
                = GenerationType.UUID){'\n'}
                {'    '}
                <span className="text-purple-400">private</span> UUID id;
                {'\n\n'}
                {'    '}
                <span className="text-amber-400">@Column</span>(name ={' '}
                <span className="text-emerald-400">"email"</span>, length = 128,
                nullable = <span className="text-purple-400">false</span>,
                unique = <span className="text-purple-400">true</span>){'\n'}
                {'    '}
                <span className="text-purple-400">private</span> String email;
                {'\n\n'}
                {'    '}
                <span className="text-amber-400">@Column</span>(name ={' '}
                <span className="text-emerald-400">"full_name"</span>, length =
                100, nullable = <span className="text-purple-400">false</span>)
                {'\n'}
                {'    '}
                <span className="text-purple-400">private</span> String
                fullName;{'\n\n'}
                {'    '}
                <span className="text-amber-400">@Enumerated</span>
                (EnumType.STRING){'\n'}
                {'    '}
                <span className="text-amber-400">@Column</span>(name ={' '}
                <span className="text-emerald-400">"tier"</span>, nullable ={' '}
                <span className="text-purple-400">false</span>){'\n'}
                {'    '}
                <span className="text-purple-400">private</span> CustomerTier
                tier;{'\n\n'}
                {'    '}
                <span className="text-amber-400">@OneToMany</span>(mappedBy ={' '}
                <span className="text-emerald-400">"customer"</span>, cascade =
                CascadeType.ALL, orphanRemoval ={' '}
                <span className="text-purple-400">true</span>){'\n'}
                {'    '}
                <span className="text-purple-400">private</span>{' '}
                List&lt;Order&gt; orders ={' '}
                <span className="text-purple-400">new</span>{' '}
                ArrayList&lt;&gt;();{'\n\n'}
                {'    '}
                <span className="text-gray-500">
                  // Standard constructors, getters, setters &
                  equals/hashCode...
                </span>
                {'\n'}
                {'}'}
              </pre>
            ) : (
              <pre className="font-mono text-xs leading-relaxed text-sky-200 text-left whitespace-pre m-0">
                <span className="text-purple-400">CREATE TABLE</span> customers
                ({'\n'}
                {'    '}id <span className="text-amber-300">UUID NOT NULL</span>
                ,{'\n'}
                {'    '}email{' '}
                <span className="text-amber-300">VARCHAR(128) NOT NULL</span>,
                {'\n'}
                {'    '}full_name{' '}
                <span className="text-amber-300">VARCHAR(100) NOT NULL</span>,
                {'\n'}
                {'    '}tier{' '}
                <span className="text-amber-300">VARCHAR(32) NOT NULL</span>,
                {'\n'}
                {'    '}
                <span className="text-purple-400">PRIMARY KEY</span> (id),{'\n'}
                {'    '}
                <span className="text-purple-400">CONSTRAINT</span>{' '}
                uq_customers_email{' '}
                <span className="text-purple-400">UNIQUE</span> (email){'\n'}
                );{'\n\n'}
                <span className="text-purple-400">
                  CREATE UNIQUE INDEX
                </span>{' '}
                idx_customer_email <span className="text-purple-400">ON</span>{' '}
                customers (email);
              </pre>
            )}
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

          {/* Sample Class with Equivalent Code (Left-aligned, No Mac window UI) */}
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
            {[
              {
                step: '01',
                title: 'Define Class Hierarchy',
                badge: 'public class',
                desc: 'Instantiate entity nodes on canvas, add typed attributes, and configure database table names.',
              },
              {
                step: '02',
                title: 'Link Associations',
                badge: '@Relationship',
                desc: 'Drag Bezier edges between nodes to define JPA cardinality and foreign key cascading.',
              },
              {
                step: '03',
                title: 'Inspect Real-time Code',
                badge: '.java & .sql',
                desc: 'Watch Java entity sources and Flyway migration scripts compile synchronously in memory.',
              },
              {
                step: '04',
                title: 'Compile & Execute',
                badge: 'mvn spring-boot:run',
                desc: 'Download standard Maven zip archive and start building your Spring Boot application immediately.',
              },
            ].map(({ step, title, badge, desc }) => (
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
