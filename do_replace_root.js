const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let originalContent = fs.readFileSync(filePath, 'utf8');
  let content = originalContent.replace(/RentalRoom/g, 'RentWise');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated: ' + filePath);
  }
}

replaceInFile('d:/FPT_UNIVERSITY/Kì 5/SWP391_SU26/README_LANDLORD_FIXED.md');
replaceInFile('d:/FPT_UNIVERSITY/Kì 5/SWP391_SU26/LANDLORD_REBUILD_SUMMARY.md');
