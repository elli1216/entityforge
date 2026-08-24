import type { ReactNode } from 'react'

export type ExampleKey = 'customer' | 'order' | 'product'

export type EntityExample = {
  id: ExampleKey
  name: string
  javaFile: string
  sqlFile: string
  tableName: string
  badgeLabel: string
  patternTitle: string
  description: string
  highlights: string[]
  indexes: Array<{ name: string; unique?: boolean }>
  fields: Array<{
    name: string
    type: string
    badges: Array<{ label: string; color: string; bg?: string }>
  }>
  javaCode: ReactNode
  sqlCode: ReactNode
}

export const EXAMPLES: Record<ExampleKey, EntityExample> = {
  customer: {
    id: 'customer',
    name: 'Customer',
    javaFile: 'src/main/java/com/entityforge/domain/models/Customer.java',
    sqlFile: 'src/main/resources/db/migration/V1__create_customers.sql',
    tableName: 'customers',
    badgeLabel: 'JPA Model',
    patternTitle: 'Aggregate Root & 1:N Association',
    description:
      'Encapsulates user identities with UUID key generation, unique column constraints, String-mapped Enums, and bidirectional @OneToMany order collections with cascade deletion.',
    highlights: [
      '@Id GenerationType.UUID',
      '@Enumerated(STRING)',
      'CascadeType.ALL',
      'Orphan Removal',
    ],
    indexes: [{ name: 'idx_customer_email', unique: true }],
    fields: [
      {
        name: 'id',
        type: 'UUID',
        badges: [
          {
            label: '@Id PK',
            color: 'var(--java-orange)',
            bg: 'rgba(237, 139, 0, 0.2)',
          },
        ],
      },
      {
        name: 'email',
        type: 'String',
        badges: [
          {
            label: 'NN',
            color: 'var(--java-blue)',
            bg: 'rgba(0, 115, 150, 0.2)',
          },
          { label: 'UN', color: '#d97706', bg: 'rgba(217, 119, 6, 0.2)' },
        ],
      },
      {
        name: 'fullName',
        type: 'String',
        badges: [
          {
            label: 'NN',
            color: 'var(--java-blue)',
            bg: 'rgba(0, 115, 150, 0.2)',
          },
        ],
      },
      {
        name: 'tier',
        type: 'CustomerTier',
        badges: [
          { label: 'ENUM', color: '#9333ea', bg: 'rgba(147, 51, 234, 0.2)' },
        ],
      },
      {
        name: 'orders',
        type: 'List<Order>',
        badges: [
          {
            label: '@OneToMany',
            color: 'var(--spring-green)',
            bg: 'rgba(109, 179, 63, 0.2)',
          },
        ],
      },
    ],
    javaCode: (
      <pre className="font-mono text-xs leading-relaxed text-gray-200 text-left whitespace-pre m-0">
        <span className="text-purple-400">package</span> com.entityforge.domain.models;{'\n\n'}
        <span className="text-purple-400">import</span> jakarta.persistence.*;{'\n'}
        <span className="text-purple-400">import</span> java.io.Serializable;{'\n'}
        <span className="text-purple-400">import</span> java.util.*;{'\n\n'}
        <span className="text-amber-400">@Entity</span>{'\n'}
        <span className="text-amber-400">@Table</span>(name = <span className="text-emerald-400">"customers"</span>, indexes = {'{'}{'\n'}
        {'    '}<span className="text-amber-400">@Index</span>(name = <span className="text-emerald-400">"idx_customer_email"</span>, columnList = <span className="text-emerald-400">"email"</span>, unique = <span className="text-purple-400">true</span>){'\n'}
        {'}'}){'\n'}
        <span className="text-purple-400">public class</span> <span className="text-sky-300 font-bold">Customer</span> <span className="text-purple-400">implements</span> Serializable {'{\n\n'}
        {'    '}<span className="text-amber-400">@Id</span>{'\n'}
        {'    '}<span className="text-amber-400">@GeneratedValue</span>(strategy = GenerationType.UUID){'\n'}
        {'    '}<span className="text-purple-400">private</span> UUID id;{'\n\n'}
        {'    '}<span className="text-amber-400">@Column</span>(name = <span className="text-emerald-400">"email"</span>, length = 128, nullable = <span className="text-purple-400">false</span>, unique = <span className="text-purple-400">true</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> String email;{'\n\n'}
        {'    '}<span className="text-amber-400">@Column</span>(name = <span className="text-emerald-400">"full_name"</span>, length = 100, nullable = <span className="text-purple-400">false</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> String fullName;{'\n\n'}
        {'    '}<span className="text-amber-400">@Enumerated</span>(EnumType.STRING){'\n'}
        {'    '}<span className="text-amber-400">@Column</span>(name = <span className="text-emerald-400">"tier"</span>, nullable = <span className="text-purple-400">false</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> CustomerTier tier;{'\n\n'}
        {'    '}<span className="text-amber-400">@OneToMany</span>(mappedBy = <span className="text-emerald-400">"customer"</span>, cascade = CascadeType.ALL, orphanRemoval = <span className="text-purple-400">true</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> List&lt;Order&gt; orders = <span className="text-purple-400">new</span> ArrayList&lt;&gt;();{'\n\n'}
        {'    '}<span className="text-gray-500">// Standard constructors, getters, setters & equals/hashCode...</span>{'\n'}
        {'}'}
      </pre>
    ),
    sqlCode: (
      <pre className="font-mono text-xs leading-relaxed text-sky-200 text-left whitespace-pre m-0">
        <span className="text-purple-400">CREATE TABLE</span> customers ({'\n'}
        {'    '}id <span className="text-amber-300">UUID NOT NULL</span>,{'\n'}
        {'    '}email <span className="text-amber-300">VARCHAR(128) NOT NULL</span>,{'\n'}
        {'    '}full_name <span className="text-amber-300">VARCHAR(100) NOT NULL</span>,{'\n'}
        {'    '}tier <span className="text-amber-300">VARCHAR(32) NOT NULL</span>,{'\n'}
        {'    '}<span className="text-purple-400">PRIMARY KEY</span> (id),{'\n'}
        {'    '}<span className="text-purple-400">CONSTRAINT</span> uq_customers_email <span className="text-purple-400">UNIQUE</span> (email){'\n'}
        );{'\n\n'}
        <span className="text-purple-400">CREATE UNIQUE INDEX</span> idx_customer_email <span className="text-purple-400">ON</span> customers (email);
      </pre>
    ),
  },
  order: {
    id: 'order',
    name: 'Order',
    javaFile: 'src/main/java/com/entityforge/domain/models/Order.java',
    sqlFile: 'src/main/resources/db/migration/V2__create_orders.sql',
    tableName: 'orders',
    badgeLabel: 'Transactional Model',
    patternTitle: 'Foreign Key & Money Precision',
    description:
      'Implements transactional integrity with BigDecimal currency mapping (12,2), lazy foreign key relationship to Customer (@ManyToOne), and multi-column query indexes.',
    highlights: [
      '@ManyToOne(LAZY)',
      'DECIMAL(12,2)',
      'Foreign Key Constraint',
      'Composite Index',
    ],
    indexes: [{ name: 'idx_orders_customer_status', unique: false }],
    fields: [
      {
        name: 'id',
        type: 'UUID',
        badges: [
          {
            label: '@Id PK',
            color: 'var(--java-orange)',
            bg: 'rgba(237, 139, 0, 0.2)',
          },
        ],
      },
      {
        name: 'orderNumber',
        type: 'String',
        badges: [
          {
            label: 'NN',
            color: 'var(--java-blue)',
            bg: 'rgba(0, 115, 150, 0.2)',
          },
          { label: 'UN', color: '#d97706', bg: 'rgba(217, 119, 6, 0.2)' },
        ],
      },
      {
        name: 'totalAmount',
        type: 'BigDecimal',
        badges: [
          {
            label: 'NN',
            color: 'var(--java-blue)',
            bg: 'rgba(0, 115, 150, 0.2)',
          },
        ],
      },
      {
        name: 'status',
        type: 'OrderStatus',
        badges: [
          { label: 'ENUM', color: '#9333ea', bg: 'rgba(147, 51, 234, 0.2)' },
        ],
      },
      {
        name: 'customer',
        type: 'Customer',
        badges: [
          {
            label: '@ManyToOne',
            color: 'var(--java-orange)',
            bg: 'rgba(237, 139, 0, 0.2)',
          },
        ],
      },
      {
        name: 'createdAt',
        type: 'Instant',
        badges: [
          {
            label: 'NN',
            color: 'var(--java-blue)',
            bg: 'rgba(0, 115, 150, 0.2)',
          },
        ],
      },
    ],
    javaCode: (
      <pre className="font-mono text-xs leading-relaxed text-gray-200 text-left whitespace-pre m-0">
        <span className="text-purple-400">package</span> com.entityforge.domain.models;{'\n\n'}
        <span className="text-purple-400">import</span> jakarta.persistence.*;{'\n'}
        <span className="text-purple-400">import</span> java.io.Serializable;{'\n'}
        <span className="text-purple-400">import</span> java.math.BigDecimal;{'\n'}
        <span className="text-purple-400">import</span> java.time.Instant;{'\n\n'}
        <span className="text-amber-400">@Entity</span>{'\n'}
        <span className="text-amber-400">@Table</span>(name = <span className="text-emerald-400">"orders"</span>, indexes = {'{'}{'\n'}
        {'    '}<span className="text-amber-400">@Index</span>(name = <span className="text-emerald-400">"idx_orders_customer_status"</span>, columnList = <span className="text-emerald-400">"customer_id, status"</span>){'\n'}
        {'}'}){'\n'}
        <span className="text-purple-400">public class</span> <span className="text-sky-300 font-bold">Order</span> <span className="text-purple-400">implements</span> Serializable {'{\n\n'}
        {'    '}<span className="text-amber-400">@Id</span>{'\n'}
        {'    '}<span className="text-amber-400">@GeneratedValue</span>(strategy = GenerationType.UUID){'\n'}
        {'    '}<span className="text-purple-400">private</span> UUID id;{'\n\n'}
        {'    '}<span className="text-amber-400">@Column</span>(name = <span className="text-emerald-400">"order_number"</span>, length = 64, nullable = <span className="text-purple-400">false</span>, unique = <span className="text-purple-400">true</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> String orderNumber;{'\n\n'}
        {'    '}<span className="text-amber-400">@Column</span>(name = <span className="text-emerald-400">"total_amount"</span>, precision = 12, scale = 2, nullable = <span className="text-purple-400">false</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> BigDecimal totalAmount;{'\n\n'}
        {'    '}<span className="text-amber-400">@Enumerated</span>(EnumType.STRING){'\n'}
        {'    '}<span className="text-amber-400">@Column</span>(name = <span className="text-emerald-400">"status"</span>, nullable = <span className="text-purple-400">false</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> OrderStatus status;{'\n\n'}
        {'    '}<span className="text-amber-400">@ManyToOne</span>(fetch = FetchType.LAZY, optional = <span className="text-purple-400">false</span>){'\n'}
        {'    '}<span className="text-amber-400">@JoinColumn</span>(name = <span className="text-emerald-400">"customer_id"</span>, nullable = <span className="text-purple-400">false</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> Customer customer;{'\n\n'}
        {'    '}<span className="text-amber-400">@Column</span>(name = <span className="text-emerald-400">"created_at"</span>, nullable = <span className="text-purple-400">false</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> Instant createdAt;{'\n\n'}
        {'    '}<span className="text-gray-500">// Constructors, getters, setters & domain methods...</span>{'\n'}
        {'}'}
      </pre>
    ),
    sqlCode: (
      <pre className="font-mono text-xs leading-relaxed text-sky-200 text-left whitespace-pre m-0">
        <span className="text-purple-400">CREATE TABLE</span> orders ({'\n'}
        {'    '}id <span className="text-amber-300">UUID NOT NULL</span>,{'\n'}
        {'    '}order_number <span className="text-amber-300">VARCHAR(64) NOT NULL</span>,{'\n'}
        {'    '}total_amount <span className="text-amber-300">DECIMAL(12, 2) NOT NULL</span>,{'\n'}
        {'    '}status <span className="text-amber-300">VARCHAR(32) NOT NULL</span>,{'\n'}
        {'    '}customer_id <span className="text-amber-300">UUID NOT NULL</span>,{'\n'}
        {'    '}created_at <span className="text-amber-300">TIMESTAMP WITH TIME ZONE NOT NULL</span>,{'\n'}
        {'    '}<span className="text-purple-400">PRIMARY KEY</span> (id),{'\n'}
        {'    '}<span className="text-purple-400">CONSTRAINT</span> uq_orders_order_number <span className="text-purple-400">UNIQUE</span> (order_number),{'\n'}
        {'    '}<span className="text-purple-400">CONSTRAINT</span> fk_orders_customer <span className="text-purple-400">FOREIGN KEY</span> (customer_id) <span className="text-purple-400">REFERENCES</span> customers (id){'\n'}
        );{'\n\n'}
        <span className="text-purple-400">CREATE INDEX</span> idx_orders_customer_status <span className="text-purple-400">ON</span> orders (customer_id, status);
      </pre>
    ),
  },
  product: {
    id: 'product',
    name: 'Product',
    javaFile: 'src/main/java/com/entityforge/domain/models/Product.java',
    sqlFile: 'src/main/resources/db/migration/V3__create_products.sql',
    tableName: 'products',
    badgeLabel: 'Catalog Entity',
    patternTitle: 'Natural Key & Default Constraints',
    description:
      'Models catalog items with natural key uniqueness (SKU), default integer stock allocation, Enum category classification, and composite multi-column indexing.',
    highlights: [
      'Unique Natural Key',
      'Default Value (0)',
      'Composite Index',
      'BigDecimal(10,2)',
    ],
    indexes: [{ name: 'idx_products_sku_category', unique: true }],
    fields: [
      {
        name: 'id',
        type: 'UUID',
        badges: [
          {
            label: '@Id PK',
            color: 'var(--java-orange)',
            bg: 'rgba(237, 139, 0, 0.2)',
          },
        ],
      },
      {
        name: 'sku',
        type: 'String',
        badges: [
          {
            label: 'NN',
            color: 'var(--java-blue)',
            bg: 'rgba(0, 115, 150, 0.2)',
          },
          { label: 'UN', color: '#d97706', bg: 'rgba(217, 119, 6, 0.2)' },
        ],
      },
      {
        name: 'title',
        type: 'String',
        badges: [
          {
            label: 'NN',
            color: 'var(--java-blue)',
            bg: 'rgba(0, 115, 150, 0.2)',
          },
        ],
      },
      {
        name: 'price',
        type: 'BigDecimal',
        badges: [
          {
            label: 'NN',
            color: 'var(--java-blue)',
            bg: 'rgba(0, 115, 150, 0.2)',
          },
        ],
      },
      {
        name: 'stockQuantity',
        type: 'Integer',
        badges: [
          {
            label: 'DEF 0',
            color: 'var(--spring-green)',
            bg: 'rgba(109, 179, 63, 0.2)',
          },
        ],
      },
      {
        name: 'category',
        type: 'ProductCategory',
        badges: [
          { label: 'ENUM', color: '#9333ea', bg: 'rgba(147, 51, 234, 0.2)' },
        ],
      },
    ],
    javaCode: (
      <pre className="font-mono text-xs leading-relaxed text-gray-200 text-left whitespace-pre m-0">
        <span className="text-purple-400">package</span> com.entityforge.domain.models;{'\n\n'}
        <span className="text-purple-400">import</span> jakarta.persistence.*;{'\n'}
        <span className="text-purple-400">import</span> java.io.Serializable;{'\n'}
        <span className="text-purple-400">import</span> java.math.BigDecimal;{'\n\n'}
        <span className="text-amber-400">@Entity</span>{'\n'}
        <span className="text-amber-400">@Table</span>(name = <span className="text-emerald-400">"products"</span>, indexes = {'{'}{'\n'}
        {'    '}<span className="text-amber-400">@Index</span>(name = <span className="text-emerald-400">"idx_products_sku_category"</span>, columnList = <span className="text-emerald-400">"sku, category"</span>, unique = <span className="text-purple-400">true</span>){'\n'}
        {'}'}){'\n'}
        <span className="text-purple-400">public class</span> <span className="text-sky-300 font-bold">Product</span> <span className="text-purple-400">implements</span> Serializable {'{\n\n'}
        {'    '}<span className="text-amber-400">@Id</span>{'\n'}
        {'    '}<span className="text-amber-400">@GeneratedValue</span>(strategy = GenerationType.UUID){'\n'}
        {'    '}<span className="text-purple-400">private</span> UUID id;{'\n\n'}
        {'    '}<span className="text-amber-400">@Column</span>(name = <span className="text-emerald-400">"sku"</span>, length = 64, nullable = <span className="text-purple-400">false</span>, unique = <span className="text-purple-400">true</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> String sku;{'\n\n'}
        {'    '}<span className="text-amber-400">@Column</span>(name = <span className="text-emerald-400">"title"</span>, length = 200, nullable = <span className="text-purple-400">false</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> String title;{'\n\n'}
        {'    '}<span className="text-amber-400">@Column</span>(name = <span className="text-emerald-400">"price"</span>, precision = 10, scale = 2, nullable = <span className="text-purple-400">false</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> BigDecimal price;{'\n\n'}
        {'    '}<span className="text-amber-400">@Column</span>(name = <span className="text-emerald-400">"stock_quantity"</span>, nullable = <span className="text-purple-400">false</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> Integer stockQuantity = 0;{'\n\n'}
        {'    '}<span className="text-amber-400">@Enumerated</span>(EnumType.STRING){'\n'}
        {'    '}<span className="text-amber-400">@Column</span>(name = <span className="text-emerald-400">"category"</span>, nullable = <span className="text-purple-400">false</span>){'\n'}
        {'    '}<span className="text-purple-400">private</span> ProductCategory category;{'\n\n'}
        {'    '}<span className="text-gray-500">// Standard getters, setters & domain methods...</span>{'\n'}
        {'}'}
      </pre>
    ),
    sqlCode: (
      <pre className="font-mono text-xs leading-relaxed text-sky-200 text-left whitespace-pre m-0">
        <span className="text-purple-400">CREATE TABLE</span> products ({'\n'}
        {'    '}id <span className="text-amber-300">UUID NOT NULL</span>,{'\n'}
        {'    '}sku <span className="text-amber-300">VARCHAR(64) NOT NULL</span>,{'\n'}
        {'    '}title <span className="text-amber-300">VARCHAR(200) NOT NULL</span>,{'\n'}
        {'    '}price <span className="text-amber-300">DECIMAL(10, 2) NOT NULL</span>,{'\n'}
        {'    '}stock_quantity <span className="text-amber-300">INTEGER NOT NULL DEFAULT 0</span>,{'\n'}
        {'    '}category <span className="text-amber-300">VARCHAR(32) NOT NULL</span>,{'\n'}
        {'    '}<span className="text-purple-400">PRIMARY KEY</span> (id),{'\n'}
        {'    '}<span className="text-purple-400">CONSTRAINT</span> uq_products_sku <span className="text-purple-400">UNIQUE</span> (sku){'\n'}
        );{'\n\n'}
        <span className="text-purple-400">CREATE UNIQUE INDEX</span> idx_products_sku_category <span className="text-purple-400">ON</span> products (sku, category);
      </pre>
    ),
  },
}

export type LifecycleStep = {
  step: string
  title: string
  badge: string
  desc: string
}

export const LIFECYCLE_STEPS: LifecycleStep[] = [
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
]
