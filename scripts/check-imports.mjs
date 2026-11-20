import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const SOURCE_ROOTS = ['src', 'tests'];
const ROOT_FILES = [
  'eslint.config.js',
  'vite.config.js',
  'vitest.config.js',
];
const EXTENSIONS = ['', '.jsx', '.js', '.css', '.json', '/index.jsx', '/index.js'];

const toPosix = (value) => value.replace(/\\/g, '/');

const walkFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const resolved = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkFiles(resolved);
    }

    return resolved;
  });
};

const sourceFiles = [
  ...SOURCE_ROOTS
    .flatMap((root) => walkFiles(path.resolve(process.cwd(), root)))
    .filter((file) => /\.(js|jsx|css|json)$/.test(file)),
  ...ROOT_FILES
    .map((file) => path.resolve(process.cwd(), file))
    .filter((file) => fs.existsSync(file)),
];

const fileMap = new Map(
  sourceFiles.map((file) => [
    toPosix(path.relative(process.cwd(), file)),
    fs.readFileSync(file, 'utf8'),
  ]),
);

const resolveImport = (fromFile, specifier) => {
  if (!specifier.startsWith('.')) return null;

  const fromDir = path.posix.dirname(fromFile);
  const base = path.posix.normalize(path.posix.join(fromDir, specifier));
  const candidates = EXTENSIONS.map((extension) => `${base}${extension}`);

  return candidates.find((candidate) => fileMap.has(candidate)) || null;
};

const getExports = (file, seen = new Set()) => {
  if (seen.has(file)) return new Set();
  seen.add(file);

  const content = fileMap.get(file) || '';
  const exports = new Set();

  if (/\bexport\s+default\b/.test(content)) {
    exports.add('default');
  }

  for (const match of content.matchAll(/\bexport\s+(?:const|function|class|let|var)\s+([A-Za-z_$][\w$]*)/g)) {
    exports.add(match[1]);
  }

  for (const match of content.matchAll(/\bexport\s*\{([^}]+)\}(?:\s+from\s+['"]([^'"]+)['"])?/g)) {
    const [, names, reExportPath] = match;
    const reExported = reExportPath ? resolveImport(file, reExportPath) : null;

    for (const rawName of names.split(',')) {
      const [localName, exportedName] = rawName.trim().split(/\s+as\s+/);
      const name = (exportedName || localName || '').trim();

      if (name) {
        exports.add(name);
      }

      if (reExported && localName?.trim()) {
        const childExports = getExports(reExported, seen);
        if (childExports.has(localName.trim())) {
          exports.add(name || localName.trim());
        }
      }
    }
  }

  for (const match of content.matchAll(/\bexport\s+\*\s+from\s+['"]([^'"]+)['"]/g)) {
    const resolved = resolveImport(file, match[1]);
    if (!resolved) continue;

    for (const exportName of getExports(resolved, seen)) {
      exports.add(exportName);
    }
  }

  return exports;
};

const parseNamedImports = (names) => names
  .split(',')
  .map((name) => name.trim().split(/\s+as\s+/)[0].trim())
  .filter(Boolean);

const errors = [];

for (const [file, content] of fileMap.entries()) {
  const importSpecs = [
    ...content.matchAll(/\bimport\s+['"]([^'"]+)['"]/g),
    ...content.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g),
  ].map((match) => ({ specifier: match[1], named: [], hasDefault: false }));

  for (const match of content.matchAll(/\bimport\s+([^'"]+?)\s+from\s+['"]([^'"]+)['"]/g)) {
    const [, clause, specifier] = match;
    const namedMatch = clause.match(/\{([^}]+)\}/);
    const hasDefault = !clause.trim().startsWith('{') && !clause.trim().startsWith('*');

    importSpecs.push({
      specifier,
      named: namedMatch ? parseNamedImports(namedMatch[1]) : [],
      hasDefault,
    });
  }

  for (const match of content.matchAll(/\bexport\s+(?:\*|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/g)) {
    importSpecs.push({ specifier: match[1], named: [], hasDefault: false });
  }

  for (const item of importSpecs) {
    const resolved = resolveImport(file, item.specifier);

    if (!item.specifier.startsWith('.')) {
      continue;
    }

    if (!resolved) {
      errors.push(`MISSING FILE: ${file} -> "${item.specifier}"`);
      continue;
    }

    if (/\.(css|json)$/.test(resolved)) {
      continue;
    }

    const exports = getExports(resolved);

    if (item.hasDefault && !exports.has('default')) {
      errors.push(`NO DEFAULT EXPORT: ${file} -> "${item.specifier}" (${resolved})`);
    }

    for (const name of item.named) {
      if (!exports.has(name)) {
        errors.push(`MISSING EXPORT: ${file} -> { ${name} } from "${item.specifier}" (${resolved})`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.sort().join('\n'));
  console.error(`\nTotal import issues: ${errors.length}`);
  process.exit(1);
}

console.log(`Import graph OK (${fileMap.size} files checked).`);
