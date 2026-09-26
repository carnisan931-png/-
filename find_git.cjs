const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let dir = __dirname;
while (dir !== path.parse(dir).root) {
  if (fs.existsSync(path.join(dir, '.git'))) {
    console.log('Found .git in:', dir);
    try {
      const output = execSync(`git --git-dir=${path.join(dir, '.git')} --work-tree=${dir} checkout src/App.tsx`, { encoding: 'utf8' });
      console.log('Successfully checkout src/App.tsx from git in:', dir, output);
      process.exit(0);
    } catch (e) {
      console.error('Failed checkout:', e.message);
    }
  }
  dir = path.dirname(dir);
}
console.log('No .git found in parents.');
