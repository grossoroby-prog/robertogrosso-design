// One-off helper: writes figma/variables.json mirroring tokens.json, in the Figma
// REST API `meta` shape. Use it to bootstrap, then replace with a real export
// (`npm run drift -- --snapshot` with FIGMA_TOKEN + FIGMA_FILE_KEY set).
import { writeFileSync } from 'node:fs';
import { loadTokens, flatten } from './tokens-lib.mjs';

const REF = /^\{([^}]+)\}$/;
const flat = flatten(loadTokens());
const id = (name) => `VariableID:${name}`;
const toFigmaColor = (hex) => {
  const h = hex.replace('#', '');
  const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
};
const typeMap = { color: 'COLOR', dimension: 'FLOAT', fontWeight: 'FLOAT', fontFamily: 'STRING' };

const variables = {};
for (const [name, { type, value }] of Object.entries(flat)) {
  const m = typeof value === 'string' && value.match(REF);
  let v;
  if (m) v = { type: 'VARIABLE_ALIAS', id: id(m[1]) };
  else if (type === 'color') v = toFigmaColor(value);
  else if (typeof value === 'string' && /^-?\d+(\.\d+)?px$/.test(value)) v = parseFloat(value);
  else v = value;
  const resolvedType = typeof v === 'string' ? 'STRING' : typeMap[type] ?? 'STRING';
  variables[id(name)] = {
    id: id(name),
    name: name.replace(/\./g, '/'),
    resolvedType,
    variableCollectionId: 'VariableCollectionId:site',
    valuesByMode: { 'mode:default': v },
  };
}
const meta = {
  variableCollections: {
    'VariableCollectionId:site': { id: 'VariableCollectionId:site', name: 'Site', defaultModeId: 'mode:default' },
  },
  variables,
};
writeFileSync(new URL('../figma/variables.json', import.meta.url), JSON.stringify(meta, null, 2) + '\n');
console.log(`seeded figma/variables.json with ${Object.keys(variables).length} variables`);
