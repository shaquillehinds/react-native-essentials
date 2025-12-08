// react-native-essentials/scripts/install-peers.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read package.json
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);

const peers = Object.keys(pkg.peerDependencies || {}).filter(
  (p) => p !== 'react' && p !== 'react-native'
);

const missing = [];
for (const peer of peers) {
  try {
    require.resolve(peer, { paths: [process.cwd()] });
    console.log($lf(19), `✅   ${peer} is installed`);
  } catch {
    missing.push(peer);
    console.log($lf(22), `❌   ${peer} is not installed`);
  }
}

if (missing.length > 0) {
  console.log(
    '\n📦 @shaquillehinds/react-native-essentials: Installing peer dependencies...\n'
  );
  console.log($lf(30), `   Installing: ${missing.join(', ')}`);

  const isExpo = fs.existsSync(path.join(process.cwd(), 'app.json'));
  const installCmd = isExpo
    ? `npx expo install ${missing.join(' ')}`
    : `npm install ${missing.join(' ')}`;

  try {
    execSync(installCmd, { stdio: 'inherit', cwd: process.cwd() });
    console.log($lf(39), '\n✅ Peer dependencies installed!\n');
  } catch (error) {
    console.error($lf(41), '\n⚠️  Auto-install failed. Please manually run:');
    console.error($lf(42), `   ${installCmd}\n`);
    process.exit(0); // Don't fail the install
  }
}

function $lf(n) {
  return '$lf|scripts/install-peers.js:' + n + ' >';
  // Automatically injected by Log Location Injector vscode extension
}
