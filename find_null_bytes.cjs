const fs = require('fs');
const content = fs.readFileSync('src/App.tsx');
let nullCount = 0;
for (let i = 0; i < content.length; i++) {
  if (content[i] === 0) {
    nullCount++;
    console.log(`Null byte found at byte index ${i}`);
  }
}
console.log('Total null bytes:', nullCount);
