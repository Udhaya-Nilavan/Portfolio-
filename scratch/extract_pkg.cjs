const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const zipPath = path.resolve('C:/Users/nilav/Downloads/portfolio_portrait_un_integration.zip');
const extractDir = path.resolve('scratch/portrait_un_pkg');

console.log('Zip file exists:', fs.existsSync(zipPath));
const tempDir = path.resolve('C:/Users/nilav/temp_pkg_extract');
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// Extract using tar to tempDir
execSync(`tar -xf "${zipPath}" -C "${tempDir}"`);

// Copy to extractDir via fs.cpSync
if (fs.existsSync(extractDir)) {
  fs.rmSync(extractDir, { recursive: true, force: true });
}
fs.cpSync(tempDir, extractDir, { recursive: true });
fs.rmSync(tempDir, { recursive: true, force: true });

console.log('Extracted files successfully:');

function listDir(dir, prefix = '') {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      console.log(prefix + item + '/');
      listDir(full, prefix + '  ');
    } else {
      console.log(prefix + item + ' (' + stat.size + ' bytes)');
    }
  }
}

listDir(extractDir);
