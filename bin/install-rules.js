#!/usr/bin/env node
/**
 * Copies the package's AI agent rules into the consuming project.
 *
 *   npx rne-rules            -> ./AGENTS.md
 *   npx rne-rules cursor     -> ./.cursor/rules/react-native-essentials.mdc
 *   npx rne-rules claude     -> ./.claude/rules/react-native-essentials.md
 *   npx rne-rules <path>     -> custom destination
 */
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'rules', 'AGENT_RULES.md');
const arg = process.argv[2];

const targets = {
  cursor: '.cursor/rules/react-native-essentials.mdc',
  claude: '.claude/rules/react-native-essentials.md',
};

const dest = path.resolve(
  process.cwd(),
  arg ? targets[arg] || arg : 'AGENTS.md'
);
const content = fs.readFileSync(source, 'utf8');

const body =
  arg === 'cursor'
    ? `---\ndescription: How to build UI with @shaquillehinds/react-native-essentials\nalwaysApply: true\n---\n\n${content}`
    : content;

fs.mkdirSync(path.dirname(dest), { recursive: true });
if (fs.existsSync(dest) && !process.argv.includes('--force')) {
  console.error(
    $lf(31),
    `${dest} already exists. Re-run with --force to overwrite.`
  );
  process.exit(1);
}
fs.writeFileSync(dest, body);
console.log(
  $lf(35),
  `Wrote agent rules to ${path.relative(process.cwd(), dest)}`
);
function $lf(n) {
  return '$lf|bin/install-rules.js:' + n + ' >';
  // Automatically injected by Log Location Injector vscode extension
}
