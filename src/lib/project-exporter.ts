import JSZip from 'jszip'
import type { Workspace } from './schema'
import { generateDdl } from './ddl-generator'
import { generateJpaEntity } from './jpa-generator'

export type ExportOptions = {
  groupId: string
  artifactId: string
  packageName: string
  version: string
}

const DEFAULT_OPTIONS: ExportOptions = {
  groupId: 'com.entityforge',
  artifactId: 'entity-forge-app',
  packageName: 'com.entityforge.domain',
  version: '1.0.0',
}

function generatePomXml(options: ExportOptions): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>${options.groupId}</groupId>
  <artifactId>${options.artifactId}</artifactId>
  <version>${options.version}</version>
  <packaging>jar</packaging>

  <name>${options.artifactId}</name>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.4.0</version>
    <relativePath/>
  </parent>

  <properties>
    <java.version>21</java.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.flywaydb</groupId>
      <artifactId>flyway-core</artifactId>
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
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

function generateApplicationProperties(options: ExportOptions): string {
  return `spring.application.name=${options.artifactId}

# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/${options.artifactId}
spring.datasource.username=postgres
spring.datasource.password=postgres

# JPA
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Flyway
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration

# Entity scanning
spring.jpa.properties.hibernate.packagesToScan=${options.packageName}
`
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

  // application.properties
  zip.file(
    `src/main/resources/application.properties`,
    generateApplicationProperties(opts),
  )

  // Entity classes
  for (const node of workspace.nodes) {
    const entity = generateJpaEntity(node, workspace.nodes, workspace.edges, opts.packageName)
    zip.file(
      `src/main/java/${pkgDir}/${entity.className}.java`,
      entity.code,
    )
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
