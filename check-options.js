const fs = require('fs');
const content = fs.readFileSync('./apps/web-client/src/lib/academy/content/units/chapter-1/sun.ts', 'utf8');

// Find all option texts
const regex = /text:\s*['"]([^'"]+)['"]/g;
let match;
let violations = [];
let index = 0;

while ((match = regex.exec(content)) !== null) {
  const text = match[1];
  if (text.length > 50) {
    violations.push({ index, text, length: text.length });
  }
  index++;
}

if (violations.length > 0) {
  console.log('Texts exceeding 50 chars:');
  violations.forEach((v) => {
    console.log(`[${v.index}] "${v.text}" (${v.length} chars)`);
  });
} else {
  console.log('No texts exceeding 50 chars found');
}
