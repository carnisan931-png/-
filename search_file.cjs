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
        // Skip some common system directories to be fast
        if (!['proc', 'sys', 'dev', 'node_modules', '.next', 'dist', 'cache'].includes(file)) {
          results = results.concat(walk(fullPath));
        }
      } else {
        if (file === 'App.tsx' && !fullPath.includes('/app/applet/')) {
          results.push(fullPath);
        }
      }
    });
  } catch (e) {
    // Ignore permissions errors
  }
  return results;
}

console.log('Searching file system...');
const found = walk('/');
console.log('Found App.tsx in other places:', found);
if (found.length > 0) {
  found.forEach(p => {
    try {
      console.log(`Path: ${p}, Size: ${fs.statSync(p).size} bytes`);
    } catch(e){}
  });
}
