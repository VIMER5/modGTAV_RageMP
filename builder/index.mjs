import * as esbuild from 'esbuild';
import path from 'path';
import envd from 'dotenv';
import context from './module/context.mjs';
import { spawn } from 'child_process';

envd.config({ debug: false });

const rootDir = path.join(import.meta.dirname, '../');
const serverRootDir = process.env.SERVER_ROOT_DIR;
const isWatch = process.argv.includes('--watch');

let outdir = {
  server: path.join(rootDir, serverRootDir, '/packages'),
  client: path.join(rootDir, serverRootDir, '/client_packages'),
};
function startTscWatch(tsconfig) {
  const tsc = spawn('tsc', ['-p', tsconfig, '--watch'], { stdio: 'inherit' });
  return tsc;
}
const tscServer = startTscWatch(path.join(rootDir, 'src/server/tsconfig.json'));
async function buildAll() {
  const server = await esbuild.context(
    context(outdir.server, 'server', rootDir),
  );

  if (isWatch) {
    await server.watch();
  } else {
    await server.rebuild();
    await server.dispose();
  }
}
buildAll().catch((err) => console.log(`Ошибка сборщика: ${err}`));
