// Token drift detector: compares tokens/tokens.json (code) with Figma variables.
//
// Source of Figma data, in order:
//   1. Live Figma REST API, when FIGMA_TOKEN and FIGMA_FILE_KEY are set
//      (GET /v1/files/:key/variables/local — needs a token with file_variables:read).
//   2. figma/variables.json, a snapshot in the same shape as the API's `meta` object.
//
// Writes public/drift-report.json (read by the footer badge and /drift page).
// Flags: --strict   exit 1 when anything drifted (for CI)
//        --snapshot write figma/variables.json from the current Figma file (needs 1.)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { loadTokens, flatten, normalise } from './tokens-lib.mjs';

const args = new Set(process.argv.slice(2));
const REF = /^\{([^}]+)\}$/;
const { FIGMA_TOKEN, FIGMA_FILE_KEY } = process.env;

async function loadFigma() {
  if (FIGMA_TOKEN && FIGMA_FILE_KEY) {
    const res = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN },
    });
    if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
    const { meta } = await res.json();
    if (args.has('--snapshot')) {
      writeFileSync(new URL('../figma/variables.json', import.meta.url), JSON.stringify(meta, null, 2) + '\n');
    }
    return { meta, source: 'figma-api' };
  }
  const path = new URL('../figma/variables.json', import.meta.url);
  if (!existsSync(path)) throw new Error('No Figma source: set FIGMA_TOKEN + FIGMA_FILE_KEY or add figma/variables.json');
  return { meta: JSON.parse(readFileSync(path, 'utf8')), source: 'snapshot' };
}

const hex2 = (n) => Math.round(n * 255).toString(16).padStart(2, '0').toUpperCase();
function figmaColorToHex({ r, g, b, a = 1 }) {
  const base = `#${hex2(r)}${hex2(g)}${hex2(b)}`;
  return a < 1 ? base + hex2(a) : base;
}

/** Turn Figma `meta` into { 'color.bg.page': { kind: 'alias'|'value', value } } using each collection's default mode. */
function figmaToFlat(meta) {
  const vars = meta.variables ?? {};
  const cols = meta.variableCollections ?? {};
  const nameOf = (id) => vars[id]?.name.replace(/\//g, '.');
  const out = {};
  for (const v of Object.values(vars)) {
    if (v.remote || v.deletedButReferenced) continue;
    const mode = cols[v.variableCollectionId]?.defaultModeId ?? Object.keys(v.valuesByMode)[0];
    const raw = v.valuesByMode[mode];
    const name = v.name.replace(/\//g, '.');
    if (raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') {
      out[name] = { kind: 'alias', value: nameOf(raw.id) ?? `unknown:${raw.id}` };
    } else if (v.resolvedType === 'COLOR') {
      out[name] = { kind: 'value', value: figmaColorToHex(raw) };
    } else {
      out[name] = { kind: 'value', value: raw };
    }
  }
  return out;
}

function compare(code, figma) {
  const drifted = [];
  const missingInFigma = [];
  let matched = 0;
  for (const [name, tok] of Object.entries(code)) {
    const f = figma[name];
    if (!f) { missingInFigma.push({ name, code: tok.value }); continue; }
    const codeAlias = typeof tok.value === 'string' && tok.value.match(REF)?.[1];
    if (codeAlias || f.kind === 'alias') {
      if (codeAlias === f.value) matched++;
      else drifted.push({ name, kind: 'alias', code: tok.value, figma: f.kind === 'alias' ? `{${f.value}}` : f.value });
      continue;
    }
    if (normalise(tok.type, tok.value) === normalise(tok.type, f.value)) matched++;
    else drifted.push({ name, kind: 'value', code: tok.value, figma: f.value });
  }
  const missingInCode = Object.keys(figma).filter((n) => !(n in code)).map((name) => ({ name, figma: figma[name].value }));
  return { matched, drifted, missingInFigma, missingInCode };
}

const code = flatten(loadTokens());
const { meta, source } = await loadFigma();
const result = compare(code, figmaToFlat(meta));
const issues = result.drifted.length + result.missingInFigma.length + result.missingInCode.length;

const report = {
  checkedAt: new Date().toISOString(),
  source,
  total: Object.keys(code).length,
  status: issues === 0 ? 'in-sync' : 'drift',
  issues,
  ...result,
};
writeFileSync(new URL('../public/drift-report.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');

console.log(`drift: ${report.matched}/${report.total} tokens match (${source}); ${issues} issue(s)`);
for (const d of result.drifted) console.log(`  ~ ${d.name}: code ${d.code} ≠ figma ${d.figma}`);
for (const d of result.missingInFigma) console.log(`  - ${d.name}: missing in Figma`);
for (const d of result.missingInCode) console.log(`  + ${d.name}: missing in code`);
if (args.has('--strict') && issues > 0) process.exit(1);
