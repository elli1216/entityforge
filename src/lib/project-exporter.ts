import JSZip from 'jszip'
import type { Workspace } from './schema'
import { generateDdl } from './ddl-generator'
import { generateJpaEntity, generateEnums } from './jpa-generator'

export type ProdDb = 'postgresql' | 'mysql'

export const SPRING_BOOT_VERSIONS = [
  { label: '4.1.1 (SNAPSHOT)', value: '4.1.1-SNAPSHOT' },
  { label: '4.1.0', value: '4.1.0' },
  { label: '4.0.8 (SNAPSHOT)', value: '4.0.8-SNAPSHOT' },
  { label: '4.0.7', value: '4.0.7' },
  { label: '3.5.16', value: '3.5.16' },
] as const

export const JAVA_VERSIONS = [17, 21, 23, 26] as const

export type ExportOptions = {
  groupId: string
  artifactId: string
  packageName: string
  version: string
  useH2: boolean
  prodDb: ProdDb
  springBootVersion: string
  javaVersion: number
}

const DEFAULT_OPTIONS: ExportOptions = {
  groupId: 'com.entityforge',
  artifactId: 'entity-forge-app',
  packageName: 'com.entityforge.domain',
  version: '1.0.0',
  useH2: true,
  prodDb: 'postgresql',
  springBootVersion: '4.1.0',
  javaVersion: 26,
}

const DB_CONFIG: Record<
  ProdDb,
  {
    driver: string
    groupId: string
    artifactId: string
    dialect: string
    url: string
  }
> = {
  postgresql: {
    driver: 'org.postgresql.Driver',
    groupId: 'org.postgresql',
    artifactId: 'postgresql',
    dialect: 'org.hibernate.dialect.PostgreSQLDialect',
    url: 'jdbc:postgresql://localhost:5432/',
  },
  mysql: {
    driver: 'com.mysql.cj.jdbc.Driver',
    groupId: 'com.mysql',
    artifactId: 'mysql-connector-j',
    dialect: 'org.hibernate.dialect.MySQLDialect',
    url: 'jdbc:mysql://localhost:3306/',
  },
}

function generatePomXml(options: ExportOptions): string {
  const db = DB_CONFIG[options.prodDb]

  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>${options.springBootVersion}</version>
    <relativePath/> <!-- lookup parent from repository -->
  </parent>
  <groupId>${options.groupId}</groupId>
  <artifactId>${options.artifactId}</artifactId>
  <version>${options.version}</version>
  <name>${options.artifactId}</name>
  <description>EntityForge generated project</description>
  <url/>
  <licenses>
    <license/>
  </licenses>
  <developers>
    <developer/>
  </developers>
  <scm>
    <connection/>
    <developerConnection/>
    <tag/>
    <url/>
  </scm>
  <properties>
    <java.version>${options.javaVersion}</java.version>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.flywaydb</groupId>
      <artifactId>flyway-core</artifactId>
    </dependency>${
      options.useH2
        ? `
    <dependency>
      <groupId>com.h2database</groupId>
      <artifactId>h2</artifactId>
      <scope>runtime</scope>
    </dependency>`
        : ''
    }
    <dependency>
      <groupId>${db.groupId}</groupId>
      <artifactId>${db.artifactId}</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
`
}

function generateDevProperties(options: ExportOptions): string {
  if (options.useH2) {
    return `spring.datasource.url=jdbc:h2:mem:${options.artifactId}
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
`
  }
  const db = DB_CONFIG[options.prodDb]
  return `spring.datasource.url=${db.url}${options.artifactId}
spring.datasource.driver-class-name=${db.driver}
spring.datasource.username=dev_user
spring.datasource.password=dev_password
spring.jpa.properties.hibernate.dialect=${db.dialect}
`
}

function generateProdProperties(options: ExportOptions): string {
  const db = DB_CONFIG[options.prodDb]
  return `spring.datasource.url=${db.url}${options.artifactId}
spring.datasource.driver-class-name=${db.driver}
spring.datasource.username=prod_user
spring.datasource.password=prod_password
spring.jpa.properties.hibernate.dialect=${db.dialect}
`
}

function generateApplicationProperties(options: ExportOptions): string {
  const lines = [`spring.application.name=${options.artifactId}`, '']

  lines.push('spring.profiles.active=dev')
  lines.push('')

  lines.push('# JPA')
  lines.push('spring.jpa.hibernate.ddl-auto=none')
  lines.push('spring.jpa.show-sql=true')
  lines.push('')

  lines.push('# Flyway')
  lines.push('spring.flyway.baseline-on-migrate=true')
  lines.push('spring.flyway.locations=classpath:db/migration')
  lines.push('')

  lines.push('# Entity scanning')
  lines.push(
    `spring.jpa.properties.hibernate.packagesToScan=${options.packageName}.models`,
  )

  return lines.join('\n')
}

async function readMvnWrapper(): Promise<Record<string, string>> {
  const files: Record<string, string> = {}
  try {
    const [mvnw, mvnwCmd, props, gitignore] = await Promise.all([
      fetch('/mvn/mvnw').then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.text()
      }),
      fetch('/mvn/mvnw.cmd').then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.text()
      }),
      fetch('/mvn/.mvn/wrapper/maven-wrapper.properties').then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.text()
      }),
      fetch('/mvn/.gitignore').then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.text()
      }),
    ])
    files['mvnw'] = mvnw
    files['mvnw.cmd'] = mvnwCmd
    files['.mvn/wrapper/maven-wrapper.properties'] = props
    files['.gitignore'] = gitignore
  } catch {
    // Maven wrapper unavailable, skip
  }
  return files
}

export async function exportProject(
  workspace: Workspace,
  options: Partial<ExportOptions> = {},
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const pkgDir = opts.packageName.replace(/\./g, '/')
  const zip = new JSZip()

  // pom.xml
  zip.file('pom.xml', generatePomXml(opts))

  // Maven wrapper
  const mvnFiles = await readMvnWrapper()
  for (const [path, content] of Object.entries(mvnFiles)) {
    zip.file(path, content)
  }

  // application.properties
  zip.file(
    `src/main/resources/application.properties`,
    generateApplicationProperties(opts),
  )

  // Dev profile
  zip.file(
    'src/main/resources/application-dev.properties',
    generateDevProperties(opts),
  )

  // Prod profile
  zip.file(
    'src/main/resources/application-prod.properties',
    generateProdProperties(opts),
  )

  // Entity + enum classes
  const modelPackage = `${opts.packageName}.models`
  for (const node of workspace.nodes) {
    const entity = generateJpaEntity(
      node,
      workspace.nodes,
      workspace.edges,
      modelPackage,
    )
    zip.file(
      `src/main/java/${pkgDir}/models/${entity.className}.java`,
      entity.code,
    )
    const enums = generateEnums(node, modelPackage)
    for (const en of enums) {
      zip.file(
        `src/main/java/${pkgDir}/models/enum/${en.className}.java`,
        en.code,
      )
    }
  }

  // Flyway migration
  if (workspace.nodes.length > 0) {
    const ddl = generateDdl(workspace.nodes, workspace.edges)
    zip.file(
      `src/main/resources/db/migration/${ddl.migrationName}.sql`,
      ddl.sql,
    )
  }

  // Application entry point
  const appClass = opts.artifactId
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
  zip.file(
    `src/main/java/${pkgDir}/${appClass}Application.java`,
    `package ${opts.packageName};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ${appClass}Application {

  public static void main(String[] args) {
    SpringApplication.run(${appClass}Application.class, args);
  }
}
`,
  )

  // Test class
  zip.file(
    `src/test/java/${pkgDir}/${appClass}ApplicationTests.java`,
    `package ${opts.packageName};

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ${appClass}ApplicationTests {

  @Test
  void contextLoads() {
  }

}
`,
  )

  // Compile and download
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${opts.artifactId}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
