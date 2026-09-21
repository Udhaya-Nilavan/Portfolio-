const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const documentsDir = 'C:/Users/nilav/OneDrive/文档';
const portfolioProjectDir = path.join(documentsDir, 'portfolio project');
const srcProject = path.join(portfolioProjectDir, 'files', 'personal-portfolio', 'UDHAYA-NILAVAN-PERSONAL-PORTFOLIO');

// Backup targets
const targetFolderDoc = path.join(documentsDir, 'portfolio 9');
const targetProjectDoc = path.join(targetFolderDoc, 'project');

const targetFolderProject = path.join(portfolioProjectDir, 'portfolio 9');
const targetProjectInPortfolio = path.join(targetFolderProject, 'project');

const docZip1 = path.join(documentsDir, 'portfolio 9.zip');
const docZip2 = path.join(documentsDir, 'UDHAYA-NILAVAN-PORTFOLIO-v9-COMPACT-CERTS.zip');

const projZip1 = path.join(portfolioProjectDir, 'portfolio 9.zip');
const projZip2 = path.join(portfolioProjectDir, 'UDHAYA-NILAVAN-PORTFOLIO-v9-COMPACT-CERTS.zip');

const artifactDir = 'C:/Users/nilav/.gemini/antigravity/brain/ff458db1-8482-4a97-89f6-55fd58c76800';
const artifactZip1 = path.join(artifactDir, 'portfolio 9.zip');
const artifactZip2 = path.join(artifactDir, 'UDHAYA-NILAVAN-PORTFOLIO-v9-COMPACT-CERTS.zip');

console.log('1. Preparing destination directory in Documents:', targetProjectDoc);
if (fs.existsSync(targetProjectDoc)) {
  fs.rmSync(targetProjectDoc, { recursive: true, force: true });
}
fs.mkdirSync(targetProjectDoc, { recursive: true });

console.log('2. Mirroring project files with robocopy...');
try {
  // Robocopy returns 1 on successful file copy
  execSync(`robocopy "${srcProject}" "${targetProjectDoc}" /E /XD node_modules .git dist scratch backups`, { stdio: 'inherit' });
} catch (e) {
  if (e.status > 3) {
    console.error('Robocopy failed with status:', e.status);
    throw e;
  }
}

console.log('3. Linking node_modules via directory junction for instant readiness...');
try {
  const targetNodeModules = path.join(targetProjectDoc, 'node_modules');
  const srcNodeModules = path.join(srcProject, 'node_modules');
  if (fs.existsSync(srcNodeModules) && !fs.existsSync(targetNodeModules)) {
    execSync(`cmd.exe /c mklink /J "${targetNodeModules}" "${srcNodeModules}"`, { stdio: 'inherit' });
  }
} catch (err) {
  console.log('Note on junction:', err.message);
}

console.log('4. Staging and compressing project into zip archive...');
const tempZipStaging = path.join(targetFolderDoc, 'staging');
if (fs.existsSync(tempZipStaging)) fs.rmSync(tempZipStaging, { recursive: true, force: true });
fs.mkdirSync(tempZipStaging, { recursive: true });

try {
  execSync(`robocopy "${targetProjectDoc}" "${tempZipStaging}" /E /XD node_modules`, { stdio: 'inherit' });
} catch (e) {
  if (e.status > 3) throw e;
}

if (fs.existsSync(docZip1)) fs.unlinkSync(docZip1);
const psZipCommand = `powershell -NoProfile -Command "Compress-Archive -Path '${tempZipStaging}\\*' -DestinationPath '${docZip1}' -Force -CompressionLevel Optimal"`;
console.log('Running zip compression to:', docZip1);
execSync(psZipCommand, { stdio: 'inherit' });

// Clean temp staging
fs.rmSync(tempZipStaging, { recursive: true, force: true });

console.log('5. Copying to other locations in Documents and Artifacts...');
fs.copyFileSync(docZip1, docZip2);
fs.copyFileSync(docZip1, projZip1);
fs.copyFileSync(docZip1, projZip2);
fs.copyFileSync(docZip1, artifactZip1);
fs.copyFileSync(docZip1, artifactZip2);

// Also mirror unzipped folder to portfolio project/portfolio 9/project
if (fs.existsSync(targetProjectInPortfolio)) {
  fs.rmSync(targetProjectInPortfolio, { recursive: true, force: true });
}
fs.mkdirSync(targetProjectInPortfolio, { recursive: true });
try {
  execSync(`robocopy "${targetProjectDoc}" "${targetProjectInPortfolio}" /E /XD node_modules`, { stdio: 'inherit' });
} catch (e) {
  if (e.status > 3) throw e;
}

console.log('Backup files successfully created:');
console.log(' - ' + docZip1 + ' (' + (fs.statSync(docZip1).size / (1024 * 1024)).toFixed(2) + ' MB)');
console.log(' - ' + docZip2);
console.log(' - ' + projZip1);
console.log(' - ' + projZip2);
console.log(' - ' + artifactZip1);
console.log(' - ' + artifactZip2);
console.log(' - ' + targetProjectDoc);
console.log('ALL BACKUP TASKS COMPLETED');
