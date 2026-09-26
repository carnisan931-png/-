const fs = require('fs');
const buffer = fs.readFileSync('src/App.tsx');
console.log('First 20 bytes:', Array.from(buffer.slice(0, 20)));
