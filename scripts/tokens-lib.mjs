// Shared helpers for reading tokens.json (DTCG-style) — used by build-tokens and drift.
import { readFileSync } from 'node:fs';

export function loadTokens(path = new URL('../tokens/tokens.json', import.meta.url)) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

/** Flatten nested tokens into { 'color.bg.page': { type, value } }, skipping $-keys. */
export function flatten(tree, prefix = [], out = {}) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$')) continue;
    if (node && typeof node === 'object' && '$value' in node) {
      out[[...prefix, key].join('.')] = { type: node.$type, value: node.$value };
    } else if (node && typeof node === 'object') {
      flatten(node, [...prefix, key], out);
    }
  }
  return out;
}

const REF = /^\{([^}]+)\}$/;

/** Resolve {alias} references to final values. */
export function resolve(flat) {
  const seen = new Set();
  const get = (name) => {
    if (seen.has(name)) throw new Error(`Circular token reference at ${name}`);
    const tok = flat[name];
    if (!tok) throw new Error(`Unknown token reference {${name}}`);
    const m = typeof tok.value === 'string' && tok.value.match(REF);
    if (!m) return tok.value;
    seen.add(name);
    const v = get(m[1]);
    seen.delete(name);
    return v;
  };
  return Object.fromEntries(Object.keys(flat).map((k) => [k, { ...flat[k], resolved: get(k) }]));
}

export const cssVar = (name) => `--${name.replace(/\./g, '-')}`;

/** Normalise a value for comparison: hex upper-case, numbers as numbers, px strings as numbers. */
export function normalise(type, value) {
  if (type === 'color' && typeof value === 'string') return value.trim().toUpperCase();
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && /^-?\d+(\.\d+)?px$/.test(value)) return parseFloat(value);
  return String(value).trim();
}
