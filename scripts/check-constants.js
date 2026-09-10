#!/usr/bin/env node
/* Internal check. Not part of the deployed site: this directory is listed in
   .vercelignore, so it is never uploaded, and no page references it.

   Run it before committing:   node scripts/check-constants.js

   It guards the values this repo keeps in more than one place by hand. Every one
   of these has already drifted or is one edit away from drifting, and none of them
   fail loudly on their own:

   1. The form version appears three times in intake.html: a header comment, the
      footer a parent reads, and INTAKE_FORM_VERSION which is what lands in the CRM
      on every submit. These were genuinely out of sync (footer v1.5.0 while the CRM
      recorded v1.6.0), which would have made it impossible to tie a data problem
      back to a form version.
   2. The draft key and TTL are mirrored between intake.html and neurohome.js,
      because intake.html loads no shared script by design. If they diverge, the
      site's "Resume your intake" CTA silently stops appearing: no error, it just
      never swaps again.
   3. neurohome.css and neurohome.js carry ?v= cache-busts that have to be bumped
      by hand across seven pages. Miss one and that page serves a stale asset to
      every returning visitor. */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

const PAGES = ['index.html', 'start.html', 'thank-you.html', 'privacy.html',
               'terms.html', 'hipaa-notice.html', 'refund-policy.html'];

const problems = [];
const checks = [];
function ok(what, detail) { checks.push({ pass: true, what, detail }); }
function bad(what, detail) { checks.push({ pass: false, what, detail }); problems.push(what); }

/* Pulls one capture group out of a file, or records a problem. A missing match is
   itself a failure: it means the declaration was renamed or moved and this check
   has quietly stopped guarding anything. */
function grab(file, src, re, label) {
  const m = src.match(re);
  if (!m) { bad(`${label} not found in ${file}`, `pattern ${re}`); return null; }
  return m[1];
}

/* Both files write the TTL as an arithmetic expression, so compare the computed
   value rather than the text: 3 * 24 * 60 * 60 * 1000 and 259200000 are the same
   promise. Only digits and arithmetic are allowed through. */
function evalMs(expr, label) {
  if (!/^[\d\s*+()]+$/.test(expr)) { bad(`${label} is not a plain arithmetic expression`, expr); return null; }
  return Function(`"use strict";return (${expr})`)();
}

// ---- 1. Form and engine versions agree across intake.html -------------------
const intake = read('intake.html');

const commentVer = grab('intake.html', intake, /form (v\d+\.\d+\.\d+)/, 'header comment form version');
const footerVer  = grab('intake.html', intake, /Form <code>(v\d+\.\d+\.\d+)<\/code>/, 'footer form version');
const constVer   = grab('intake.html', intake, /INTAKE_FORM_VERSION\s*=\s*'(v\d+\.\d+\.\d+)'/, 'INTAKE_FORM_VERSION');

if (commentVer && footerVer && constVer) {
  if (commentVer === footerVer && footerVer === constVer) {
    ok('form version agrees in all 3 places', constVer);
  } else {
    bad('form version disagrees with itself',
        `header comment ${commentVer}, footer ${footerVer}, CRM constant ${constVer}`);
  }
}

const footerEngine = grab('intake.html', intake, /Engine <code>(v\d+\.\d+\.\d+)<\/code>/, 'footer engine version');
const constEngine  = grab('intake.html', intake, /INTAKE_ENGINE_VERSION\s*=\s*'(v\d+\.\d+\.\d+)'/, 'INTAKE_ENGINE_VERSION');
if (footerEngine && constEngine) {
  if (footerEngine === constEngine) ok('engine version agrees in both places', constEngine);
  else bad('engine version disagrees with itself', `footer ${footerEngine}, constant ${constEngine}`);
}

// ---- 2. Draft constants mirrored into neurohome.js --------------------------
const shared = read('neurohome.js');

const intakeSchema = grab('intake.html', intake, /const DRAFT_SCHEMA_VERSION\s*=\s*(\d+)/, 'intake DRAFT_SCHEMA_VERSION');
const sharedSchema = grab('neurohome.js', shared, /var DRAFT_SCHEMA_VERSION\s*=\s*(\d+)/, 'shared DRAFT_SCHEMA_VERSION');
if (intakeSchema && sharedSchema) {
  if (intakeSchema === sharedSchema) ok('draft schema version mirrored', intakeSchema);
  else bad('draft schema version out of sync, the Resume CTA will never appear',
           `intake.html ${intakeSchema}, neurohome.js ${sharedSchema}`);
}

const intakeTtlExpr = grab('intake.html', intake, /const DRAFT_TTL_MS\s*=\s*([^;]+);/, 'intake DRAFT_TTL_MS');
const sharedTtlExpr = grab('neurohome.js', shared, /var DRAFT_TTL_MS\s*=\s*([^;]+);/, 'shared DRAFT_TTL_MS');
if (intakeTtlExpr && sharedTtlExpr) {
  const a = evalMs(intakeTtlExpr.trim(), 'intake DRAFT_TTL_MS');
  const b = evalMs(sharedTtlExpr.trim(), 'shared DRAFT_TTL_MS');
  if (a !== null && b !== null) {
    if (a === b) ok('draft TTL mirrored', `${a / 86400000} days`);
    else bad('draft TTL out of sync, the site will offer to resume drafts the intake discards',
             `intake.html ${a / 86400000}d, neurohome.js ${b / 86400000}d`);
  }
}

// ---- 3. Asset cache-busts agree across every page --------------------------
['css', 'js'].forEach(ext => {
  const seen = new Map();
  PAGES.forEach(p => {
    const src = read(p);
    const m = src.match(new RegExp(`neurohome\\.${ext}\\?v=(\\d+)`));
    if (!m) { bad(`${p} does not reference neurohome.${ext}`, 'expected a ?v= cache-bust'); return; }
    if (!seen.has(m[1])) seen.set(m[1], []);
    seen.get(m[1]).push(p);
  });
  if (seen.size === 1) {
    ok(`neurohome.${ext} cache-bust agrees on all ${PAGES.length} pages`, `v=${[...seen.keys()][0]}`);
  } else if (seen.size > 1) {
    bad(`neurohome.${ext} cache-bust differs between pages, some will serve a stale asset`,
        [...seen.entries()].map(([v, ps]) => `v=${v}: ${ps.join(', ')}`).join(' | '));
  }
});

// ---- 4. Every selectable country has a dial code, and vice versa ------------
/* start.html renders 197 country options and posts the phone to GHL in E.164,
   which means every one of those options needs a dial code. The two lists are
   hand-maintained in the same file and nothing else connects them: add a
   country to the select and forget the map, and that parent's number is posted
   raw — no error, no console warning, and GHL accepts the garbage. Add a code
   for a country the select does not offer and the map quietly rots.

   Checked here rather than at runtime because runtime is too late: the failure
   is invisible to the parent, invisible to us, and only shows up as an
   unreachable lead days later. */
const start = read('start.html');

function arrayLiteral(label, re) {
  const m = start.match(re);
  if (!m) { bad(`could not find ${label} in start.html`, 'the declaration was renamed or moved'); return null; }
  try { return JSON.parse(m[1]); }
  catch (e) { bad(`${label} in start.html is not parseable`, e.message); return null; }
}

const priority = arrayLiteral('PRIORITY_COUNTRIES', /const PRIORITY_COUNTRIES = (\[[^;]*\]);/);
const countries = arrayLiteral('COUNTRIES', /const COUNTRIES = (\[[^;]*\]);/);
const dialMatch = start.match(/const DIAL_CODES = \{([\s\S]*?)\n\};/);

if (!dialMatch) {
  bad('could not find DIAL_CODES in start.html', 'the declaration was renamed or moved');
} else if (priority && countries) {
  // Parsed by regex rather than eval: this script must never execute page code.
  const dial = {};
  for (const m of dialMatch[1].matchAll(/"((?:[^"\\]|\\.)*)"\s*:\s*"(\+\d{1,4})"/g)) {
    dial[m[1].replace(/\\"/g, '"')] = m[2];
  }
  const selectable = [...priority, ...countries];
  const missing = selectable.filter(c => !dial[c]);
  const orphaned = Object.keys(dial).filter(c => !selectable.includes(c));

  if (Object.keys(dial).length === 0) {
    bad('DIAL_CODES parsed to zero entries, this check is guarding nothing',
        'the entry format changed and the regex above no longer matches');
  } else if (missing.length || orphaned.length) {
    bad('country list and DIAL_CODES disagree, some leads will post a non-E.164 phone',
        [missing.length ? `no dial code: ${missing.join(', ')}` : '',
         orphaned.length ? `not in the select: ${orphaned.join(', ')}` : ''].filter(Boolean).join(' | '));
  } else {
    ok('every selectable country has a dial code', `${selectable.length} countries`);
  }
}

// ---- report ----------------------------------------------------------------
checks.forEach(c => console.log(`${c.pass ? 'ok  ' : 'FAIL'}  ${c.what}${c.detail ? `  (${c.detail})` : ''}`));
console.log('');
if (problems.length) {
  console.error(`${problems.length} problem${problems.length === 1 ? '' : 's'} found.`);
  process.exit(1);
}
console.log(`${checks.length} checks passed.`);
