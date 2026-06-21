const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let originalContent = fs.readFileSync(filePath, 'utf8');
  let content = originalContent.replace(/RentalRoom/g, 'RentWise');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated: ' + filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walk(filePath);
      }
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.css') || filePath.endsWith('.html') || filePath.endsWith('.md')) {
      replaceInFile(filePath);
    }
  }
}

walk('d:/FPT_UNIVERSITY/Kì 5/SWP391_SU26/client');
