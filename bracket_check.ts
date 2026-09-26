import * as fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

let depth = 0;
const stack: { line: number, char: string }[] = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Simple brace parser ignoring strings and comments
  let inString: string | null = null;
  let inTemplate = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    
    // Skip escaped characters
    if (j > 0 && line[j - 1] === '\\') {
      continue;
    }
    
    // Ignore strings
    if (inString === null && !inTemplate) {
      if (char === "'" || char === '"') {
        inString = char;
        continue;
      }
      if (char === '`') {
        inTemplate = true;
        continue;
      }
    } else if (inString !== null) {
      if (char === inString) {
        inString = null;
      }
      continue;
    } else if (inTemplate) {
      if (char === '`') {
        inTemplate = false;
      }
      continue;
    }
    
    // Match braces
    if (char === '{') {
      depth++;
      stack.push({ line: i + 1, char });
    } else if (char === '}') {
      depth--;
      if (stack.length > 0) {
        stack.pop();
      } else {
        console.log(`Unmatched closing brace '}' on Line ${i + 1}`);
      }
    }
  }
}

console.log(`Final brace nesting depth: ${depth}`);
if (stack.length > 0) {
  console.log(`Unmatched opening braces (Top 5 deepest in stack):`);
  stack.slice(-5).forEach(item => {
    console.log(`- Opened on Line ${item.line}`);
  });
}
