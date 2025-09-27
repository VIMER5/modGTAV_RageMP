import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
function addMkdir(rootDir) {
  const tempDir = {
    client: path.join(rootDir, 'builder/temp/client'),
    server: path.join(rootDir, 'builder/temp/server'),
  };
  if (!fs.existsSync(tempDir.client)) {
    fs.mkdirSync(tempDir.client, { recursive: true });
  }
  if (!fs.existsSync(tempDir.server)) {
    fs.mkdirSync(tempDir.server, { recursive: true });
  }
}
async function startTscWatch(name, rootDir) {
  return spawn(
    'npx',
    ['tsc', '-p', `${rootDir}/src/${name}/tsconfig.json`, '--watch'],
    {
      stdio: 'inherit',
      shell: true,
    },
  );
}

function removeFile(oldPath) {
  const newPath = oldPath.includes('src\\server')
    ? oldPath.replace('src\\server', 'builder\\temp\\server')
    : oldPath.replace('src\\client', 'builder\\temp\\client');
  const fullPath = newPath.replace('.ts', '.js');
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { force: true });
    console.log(`Удалил: ${fullPath}`);
  }
}
export { addMkdir, startTscWatch, removeFile };
