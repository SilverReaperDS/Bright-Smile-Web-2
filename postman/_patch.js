const fs = require('fs');
const path = 'postman/collections/Bright-Smile-Messages/get-messages.request.yaml';
let c = fs.readFileSync(path, 'utf8');
const needle = 'order: 1000\r\nscripts:';
const replacement = 'order: 1000\r\nheaders:\r\n  - key: Authorization\r\n    value: \'Bearer {{token}}\'\r\nscripts:';
if (c.includes(needle)) {
  c = c.replace(needle, replacement);
  fs.writeFileSync(path, c, 'utf8');
  console.log('Updated successfully');
} else {
  console.log('Pattern not found, trying LF variant...');
  const needle2 = 'order: 1000\nscripts:';
  const replacement2 = 'order: 1000\nheaders:\n  - key: Authorization\n    value: \'Bearer {{token}}\'\nscripts:';
  if (c.includes(needle2)) {
    c = c.replace(needle2, replacement2);
    fs.writeFileSync(path, c, 'utf8');
    console.log('Updated successfully (LF)');
  } else {
    console.log('Could not find pattern. File content start: ' + c.substring(0, 200));
  }
}
