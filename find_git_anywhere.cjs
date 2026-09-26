const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        return;
      }
      if (stat && stat.isDirectory()) {
        if (file === '.git') {
          results.push(fullPath);
        } else {
          // Skip some system/common directories
          if (!['proc', 'sys', 'dev', 'node_modules', '.next', 'dist', 'cache', 'lib', 'lib64', 'bin', 'sbin', 'usr', 'etc', 'var/log'].includes(file)) {
            results = results.concat(walk(fullPath));
          }
        }
      }
    });
  } catch (e) {}
  return results;
}

console.log('Searching file system for any .git...');
const found = walk('/');
console.log('Found .git in:', found);
