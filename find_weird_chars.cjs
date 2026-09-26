const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const weirdChars = [];
for (let i = 0; i < content.length; i++) {
  const code = content.charCodeAt(i);
  if (code === 65533) {
    weirdChars.push({ index: i, char: content[i], code });
  }
}
console.log('Weird characters (code 65533):', weirdChars.length);
if (weirdChars.length > 0) {
  console.log('First 5 weird characters:', weirdChars.slice(0, 5));
}
