const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const content = fs.readFileSync(envPath, 'utf8');

console.log('--- ENV CHECK ---');
content.split('\n').forEach(line => {
  if (line.startsWith('AUTH_GOOGLE_ID=')) {
    const val = line.split('=')[1].trim();
    console.log('Value found:', val);
    console.log('Length:', val.length);
    console.log('First char code:', val.charCodeAt(0));
    console.log('Last char code:', val.charCodeAt(val.length - 1));
  }
});
console.log('-----------------');
