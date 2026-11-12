#!/usr/bin/env node
/*
  =====================================================================
  build.mjs — checks content.js, then builds index.html
  =====================================================================
  Run it from this folder:

      node build.mjs

  What it does:
    1. Reads content.js and checks it for mistakes.
    2. If something is wrong, it explains what to fix and stops.
       index.html is left exactly as it was.
    3. If everything is fine, it puts the content into a copy of
       template.html and saves that as index.html.
    4. It lists every [TBD: ...] and [CONFIRM: ...] note that still
       needs an answer (these are reminders, not errors).

  No installs needed: this uses only what comes with Node.js.
  =====================================================================
*/

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = join(HERE, 'content.js');
const TEMPLATE_PATH = join(HERE, 'template.html');
const OUTPUT_PATH = join(HERE, 'index.html');
const MARKER = '@@CONTENT@@';

const ITEM_TYPES = ['say', 'ask', 'info', 'do', 'rule'];
const NODE_FIELDS = ['title', 'items', 'options', 'keywords', 'todo'];
const ITEM_FIELDS = ['type', 'text', 'why', 'exact'];
const OPTION_FIELDS = ['label', 'to', 'hint'];
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NOTE_PATTERN = /\[(TBD|CONFIRM):\s*([^\]]*)\]/g;

/* ---------- Output helpers ---------- */
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code) => (s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const red = paint('31');
const yellow = paint('33');
const green = paint('32');
const bold = paint('1');
const dim = paint('2');

const errors = [];
const warnings = [];
const problem = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

function stopWithErrors() {
  console.log('');
  console.log(red(bold(`✖ Can't build yet. Please fix ${errors.length === 1 ? 'this problem' : `these ${errors.length} problems`} in content.js, then run  node build.mjs  again:`)));
  console.log('');
  errors.forEach((msg, i) => {
    const lines = msg.split('\n');
    console.log(`  ${bold(String(i + 1) + '.')} ${lines[0]}`);
    lines.slice(1).forEach((l) => console.log(`     ${l}`));
    console.log('');
  });
  printWarnings();
  console.log(dim('index.html was not changed.'));
  console.log('');
  process.exit(1);
}

function printWarnings() {
  if (!warnings.length) return;
  console.log(yellow(bold(`⚠ ${warnings.length === 1 ? '1 thing' : `${warnings.length} things`} to look at (these don't stop the build):`)));
  warnings.forEach((w) => console.log(yellow(`  • ${w.split('\n').join('\n    ')}`)));
  console.log('');
}

/* ---------- Small utilities ---------- */
function lineStarts(src) {
  const starts = [0];
  for (let i = 0; i < src.length; i++) if (src[i] === '\n') starts.push(i + 1);
  return starts;
}
function lineAt(starts, index) {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= index) lo = mid; else hi = mid - 1;
  }
  return lo + 1;
}
function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}
function closest(word, choices) {
  let best = null;
  let bestD = Infinity;
  for (const c of choices) {
    const d = distance(String(word).toLowerCase(), String(c).toLowerCase());
    if (d < bestD) { bestD = d; best = c; }
  }
  return best !== null && bestD <= Math.max(2, Math.floor(String(word).length / 3)) ? best : null;
}
const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isText = (v) => typeof v === 'string' && v.trim() !== '';
const quote = (s) => `"${s}"`;

/* ---------- Find step ids (and their line numbers) in the raw text ----------
   JavaScript quietly keeps only the LAST of two steps with the same id, so
   duplicates can't be seen after loading. This reads the file as text instead,
   skipping comments and strings, and lists every key directly inside "nodes". */
function findStepIds(src) {
  const starts = lineStarts(src);
  const found = [];
  const stack = [];
  let pendingKey = null;
  let i = 0;
  const n = src.length;

  const skipSpace = (j) => {
    while (j < n) {
      if (/\s/.test(src[j])) j++;
      else if (src.startsWith('//', j)) { while (j < n && src[j] !== '\n') j++; }
      else if (src.startsWith('/*', j)) { const e = src.indexOf('*/', j + 2); j = e < 0 ? n : e + 2; }
      else break;
    }
    return j;
  };
  const insideNodes = () => stack.length === 2 && stack[0].type === '{' && stack[1].type === '{' && stack[1].key === 'nodes';
  const onKey = (key, at) => {
    if (insideNodes()) found.push({ id: key, line: lineAt(starts, at) });
    pendingKey = key;
  };

  while (i < n) {
    const c = src[i];
    if (src.startsWith('//', i)) { while (i < n && src[i] !== '\n') i++; continue; }
    if (src.startsWith('/*', i)) { const e = src.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      const at = i;
      let j = i + 1;
      let value = '';
      while (j < n && src[j] !== c) {
        if (src[j] === '\\') { value += src[j + 1] || ''; j += 2; continue; }
        value += src[j];
        j++;
      }
      j++;
      const k = skipSpace(j);
      if (src[k] === ':') { onKey(value, at); i = k + 1; } else { pendingKey = null; i = j; }
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      const at = i;
      let j = i;
      while (j < n && /[\w$]/.test(src[j])) j++;
      const word = src.slice(i, j);
      const k = skipSpace(j);
      if (src[k] === ':') { onKey(word, at); i = k + 1; } else { pendingKey = null; i = j; }
      continue;
    }
    if (c === '{' || c === '[') { stack.push({ type: c, key: pendingKey }); pendingKey = null; i++; continue; }
    if (c === '}' || c === ']') { stack.pop(); pendingKey = null; i++; continue; }
    if (!/\s/.test(c)) pendingKey = null;
    i++;
  }
  return found;
}

/* ---------- 1. Read the files ---------- */
console.log(dim('Checking content.js …'));

if (!existsSync(CONTENT_PATH)) {
  problem(`I can't find content.js. It must be in the same folder as build.mjs:\n${HERE}`);
  stopWithErrors();
}
if (!existsSync(TEMPLATE_PATH)) {
  problem(`I can't find template.html. It must be in the same folder as build.mjs:\n${HERE}`);
  stopWithErrors();
}
const source = readFileSync(CONTENT_PATH, 'utf8');
const template = readFileSync(TEMPLATE_PATH, 'utf8');
const sourceLines = source.split('\n');

/* ---------- 2. Load content.js ---------- */
if (!/^\s*export\s+default\s+/m.test(source)) {
  problem('content.js must contain the line  export default {  right before the content starts.\nIt looks like it was deleted or changed. Put it back just above  meta: {');
  stopWithErrors();
}
const code = source.replace(/^(\s*)export\s+default\s+/m, '$1module.exports = ');
const sandbox = { module: { exports: undefined } };
try {
  vm.runInNewContext(code, sandbox, { filename: 'content.js', timeout: 3000 });
} catch (err) {
  const where = /content\.js:(\d+)/.exec(String(err && err.stack));
  const line = where ? Number(where[1]) : null;
  const reason = String((err && err.message) || err).replace(/\s+/g, ' ');
  let msg = `content.js has a typo that stops it from being read${line ? ` (around line ${line})` : ''}.\nThe computer says: ${reason}`;
  if (line) {
    msg += '\n';
    for (let l = Math.max(1, line - 2); l <= Math.min(sourceLines.length, line); l++) {
      msg += `\n${l === line ? '→' : ' '} ${String(l).padStart(4)} | ${sourceLines[l - 1]}`;
    }
    const near = sourceLines.slice(Math.max(0, line - 3), line).join('\n');
    msg += '\n';
    if (/(:\s*[“”])|([“”]\s*,\s*$)|([[(]\s*[“”])/m.test(near)) {
      msg += '\nIt looks like curly quotes (“ ”) are being used around text. Around text, use straight quotes (") instead.\nYour editor may have changed them automatically: turn off "smart quotes" and retype them.';
    } else {
      msg += '\nCommon causes: a missing comma at the end of the line ABOVE the arrow, a missing or extra\nstraight quote mark ("), or a straight quote inside text (use curly quotes “ ” inside text).';
    }
  }
  problem(msg);
  stopWithErrors();
}

const content = sandbox.module.exports;
if (!isPlainObject(content)) {
  problem('content.js must export one object: export default { meta: {...}, startId: "...", nodes: {...} };');
  stopWithErrors();
}

/* ---------- 3. Check the structure ---------- */
const { meta, startId, nodes } = content;

if (!isPlainObject(meta)) {
  problem('The "meta" section is missing. It should look like:\nmeta: { title: "DTF U Village · Phone Call Guide", lastUpdated: "2026-11-11", version: "1.0.0" },');
} else {
  if (!isText(meta.title)) warn('meta.title is empty. The page header will show a generic title.');
  if (!isText(meta.lastUpdated)) warn('meta.lastUpdated is empty. The footer shows this date, so set it to today (YYYY-MM-DD).');
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.lastUpdated)) warn(`meta.lastUpdated is ${quote(meta.lastUpdated)}. Use the format YYYY-MM-DD, for example "2026-11-11".`);
  if (!isText(meta.version)) warn('meta.version is empty.');
}
if (!isPlainObject(nodes) || !Object.keys(nodes).length) {
  problem('The "nodes" section is missing or empty. It holds every step of the guide.');
  stopWithErrors();
}

const ids = Object.keys(nodes);
const stepIds = findStepIds(source);
const lineOf = {};
stepIds.forEach(({ id, line }) => { if (!(id in lineOf)) lineOf[id] = line; });
const at = (id) => (lineOf[id] ? ` (content.js line ${lineOf[id]})` : '');
const stepName = (id) => `Step ${quote(id)}${at(id)}`;

// Duplicate ids
const seenLines = {};
stepIds.forEach(({ id, line }) => { (seenLines[id] = seenLines[id] || []).push(line); });
Object.entries(seenLines).forEach(([id, lines]) => {
  if (lines.length > 1) {
    problem(`The id ${quote(id)} is used for ${lines.length} different steps (content.js lines ${lines.join(' and ')}).\nEvery step needs its own id. Rename one of them, and update any options that should point to it.\n(Only the last one is kept, so fixing this may also fix some "can't be reached" problems below.)`);
  }
});

if (!isText(startId)) {
  problem('startId is missing. Add  startId: "ring",  above nodes. It is the step every call starts on.');
} else if (!nodes[startId]) {
  const guess = closest(startId, ids);
  problem(`startId is ${quote(startId)}, but there is no step with that id.${guess ? ` Did you mean ${quote(guess)}?` : ''}`);
}

for (const id of ids) {
  const node = nodes[id];
  const name = stepName(id);
  if (!ID_PATTERN.test(id)) {
    problem(`${name}: the id can only use lowercase letters, numbers and single dashes (like "lost-found"),\nbecause it is used in links. Rename it, and update any options that point to it.`);
  }
  if (!isPlainObject(node)) {
    problem(`${name} isn't written as a step. A step starts with { and ends with },`);
    continue;
  }
  for (const key of Object.keys(node)) {
    if (!NODE_FIELDS.includes(key)) {
      const guess = closest(key, NODE_FIELDS);
      warn(`${name} has an unknown field ${quote(key)}, which the guide ignores.${guess ? ` Did you mean ${quote(guess)}?` : ''}`);
    }
  }
  if (!isText(node.title)) problem(`${name} has no title. Add a line like  title: "Short title",`);

  // Items
  if (node.items === undefined) {
    warn(`${name} has no items, so the card will only show its title and buttons.`);
  } else if (!Array.isArray(node.items)) {
    problem(`${name}: "items" must be a list in square brackets: items: [ ... ],`);
  } else {
    if (!node.items.length) warn(`${name} has an empty items list, so the card will only show its title and buttons.`);
    node.items.forEach((item, i) => {
      const where = `${name}, item ${i + 1}`;
      if (!isPlainObject(item)) { problem(`${where} isn't written as an item. It should look like: { type: "say", text: "..." },`); return; }
      if (!ITEM_TYPES.includes(item.type)) {
        const guess = item.type ? closest(item.type, ITEM_TYPES) : null;
        problem(`${where} has type ${item.type === undefined ? '(missing)' : quote(item.type)}. The type must be one of: ${ITEM_TYPES.join(', ')}.${guess ? `\nDid you mean ${quote(guess)}?` : ''}`);
      }
      if (!isText(item.text)) problem(`${where} has no text. Add  text: "..."  or delete the item.`);
      if (item.why !== undefined && !isText(item.why)) problem(`${where} has an empty "why". Write the explanation, or delete the why line.`);
      if (item.exact !== undefined && typeof item.exact !== 'boolean') problem(`${where}: exact must be true or false (no quotes).`);
      for (const key of Object.keys(item)) {
        if (!ITEM_FIELDS.includes(key)) {
          const guess = closest(key, ITEM_FIELDS);
          warn(`${where} has an unknown field ${quote(key)}, which the guide ignores.${guess ? ` Did you mean ${quote(guess)}?` : ''}`);
        }
      }
    });
  }

  // Options
  if (node.options === undefined || (Array.isArray(node.options) && node.options.length === 0)) {
    problem(`${name} has no options, so a cashier would get stuck there.\nAdd at least one button. To end a topic, use:  options: [ { label: "Done — wrap up", to: "wrap" }, ],`);
  } else if (!Array.isArray(node.options)) {
    problem(`${name}: "options" must be a list in square brackets: options: [ ... ],`);
  } else {
    if (node.options.length > 10) warn(`${name} has ${node.options.length} options. Only the first 10 get a number key (1–9, 0).`);
    node.options.forEach((opt, i) => {
      const where = `${name}, option ${i + 1}${opt && isText(opt.label) ? ` (${quote(opt.label)})` : ''}`;
      if (!isPlainObject(opt)) { problem(`${where} isn't written as an option. It should look like: { label: "Button text", to: "step-id" },`); return; }
      if (!isText(opt.label)) problem(`${where} has no label, so its button would be blank. Add  label: "..."`);
      if (!isText(opt.to)) {
        problem(`${where} doesn't say where it goes. Add  to: "step-id"  with the id of the next step.`);
      } else if (!nodes[opt.to]) {
        const guess = closest(opt.to, ids);
        problem(`${where} goes to ${quote(opt.to)}, but there is no step with that id.\n${guess ? `Did you mean ${quote(guess)}? ` : ''}Check the spelling after "to:", or add a step called ${quote(opt.to)}.`);
      }
      if (opt.hint !== undefined && typeof opt.hint !== 'string') problem(`${where}: hint must be text in quotes.`);
      for (const key of Object.keys(opt)) {
        if (!OPTION_FIELDS.includes(key)) {
          const guess = closest(key, OPTION_FIELDS);
          warn(`${where} has an unknown field ${quote(key)}, which the guide ignores.${guess ? ` Did you mean ${quote(guess)}?` : ''}`);
        }
      }
    });
  }

  // Keywords and todo
  if (node.keywords === undefined) warn(`${name} has no keywords, so Search will only find it by its title and text.`);
  else if (!Array.isArray(node.keywords) || node.keywords.some((k) => typeof k !== 'string')) {
    problem(`${name}: keywords must be a list of words in quotes, like  keywords: ["wallet", "lost"],`);
  }
  if (node.todo !== undefined && typeof node.todo !== 'boolean') problem(`${name}: todo must be true or false (no quotes).`);
}

/* ---------- 4. Check that every step can be reached ---------- */
if (nodes[startId]) {
  const reached = new Set([startId]);
  const queue = [startId];
  while (queue.length) {
    const id = queue.shift();
    const opts = Array.isArray(nodes[id] && nodes[id].options) ? nodes[id].options : [];
    for (const o of opts) {
      if (o && nodes[o.to] && !reached.has(o.to)) { reached.add(o.to); queue.push(o.to); }
    }
  }
  for (const id of ids) {
    if (!reached.has(id)) {
      problem(`${stepName(id)} can't be reached: no button anywhere leads to it, starting from ${quote(startId)}.\nAdd an option that goes to ${quote(id)} (for a new topic, add it to the options of the "hub" step), or delete the step.`);
    }
  }

  // No dead-end loops: from every step there should be a way back to the start of a call.
  const back = {};
  for (const id of ids) {
    const opts = Array.isArray(nodes[id] && nodes[id].options) ? nodes[id].options : [];
    for (const o of opts) if (o && nodes[o.to]) (back[o.to] = back[o.to] || []).push(id);
  }
  const canFinish = new Set([startId]);
  const q2 = [startId];
  while (q2.length) {
    const id = q2.shift();
    for (const p of back[id] || []) if (!canFinish.has(p)) { canFinish.add(p); q2.push(p); }
  }
  const stuck = [...reached].filter((id) => !canFinish.has(id));
  if (stuck.length) {
    warn(`From these steps there's no way to finish the call and start a new one: ${stuck.map(quote).join(', ')}.\nMake sure each topic ends with an option that goes to "wrap".`);
  }
}

if (errors.length) stopWithErrors();

/* ---------- 5. List notes that still need info ---------- */
const notes = [];
for (const id of ids) {
  const node = nodes[id];
  const texts = [node.title]
    .concat((node.items || []).flatMap((it) => [it.text, it.why]))
    .concat((node.options || []).flatMap((o) => [o.label, o.hint]))
    .filter((t) => typeof t === 'string');
  for (const t of texts) {
    for (const m of t.matchAll(NOTE_PATTERN)) notes.push({ id, title: node.title, kind: m[1], note: m[2].trim() });
  }
}

/* ---------- 6. Build index.html ---------- */
const markerCount = template.split(MARKER).length - 1;
if (markerCount !== 1) {
  problem(`template.html must contain the content marker ${MARKER} exactly once (found ${markerCount}).\nThe marker line was changed or deleted. Get a fresh copy of template.html.`);
  stopWithErrors();
}
const json = JSON.stringify(content, null, 2)
  .replace(/</g, '\\u003c')
  .split(String.fromCharCode(0x2028)).join('\\u2028')
  .split(String.fromCharCode(0x2029)).join('\\u2029');
const lines = template.split('\n');
const markerLine = lines.findIndex((l) => l.includes(MARKER));
lines[markerLine] = `window.GUIDE_CONTENT = ${json};`;
let output = lines.join('\n');
output = output.replace(
  /^<!DOCTYPE html>\s*\n/i,
  '<!DOCTYPE html>\n<!-- GENERATED FILE: made by build.mjs from template.html + content.js. Do not edit it by hand. To change the guide, edit content.js and run: node build.mjs -->\n'
);
writeFileSync(OUTPUT_PATH, output, 'utf8');

/* ---------- 7. Report ---------- */
console.log('');
console.log(green(bold(`✔ Built index.html: ${ids.length} steps, every option links to a real step, and every step can be reached.`)));
console.log('');
printWarnings();
if (notes.length) {
  console.log(yellow(bold(`⚑ ${notes.length} note${notes.length === 1 ? '' : 's'} still need${notes.length === 1 ? 's' : ''} info (shown as yellow "Needs info" badges in the guide):`)));
  for (const n of notes) console.log(yellow(`  • ${n.id} (${n.title}) — ${n.kind}: ${n.note}`));
  console.log('');
}
console.log(`Next: open ${bold('index.html')} in your browser to check it, then upload ${bold('index.html')} AND ${bold('content.js')} to GitHub.`);
console.log('');
