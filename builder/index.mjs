import * as esbuild from 'esbuild';
import path from 'path';
import envd from 'dotenv';
import context from './module/context.mjs';
import chokidar from 'chokidar';
import { addMkdir, startTscWatch, removeFile } from './module/funcBuilder.mjs';

envd.config({ debug: false });

const rootDir = path.join(import.meta.dirname, '../');
const serverRootDir = process.env.SERVER_ROOT_DIR;

addMkdir(rootDir);

let outdir = {
  server: path.join(rootDir, serverRootDir, '/packages'),
  client: path.join(rootDir, serverRootDir, '/client_packages'),
};

async function buildAll() {
  await startTscWatch('server', rootDir);
  await startTscWatch('client', rootDir);
  const server = await esbuild.context(
    context(outdir.server, 'server', rootDir),
  );
  const client = await esbuild.context(
    context(outdir.client, 'client', rootDir),
  );
  await server.watch();
  await client.watch();
}
chokidar
  .watch(path.join(rootDir, 'src/server/'), { ignoreInitial: true })
  .on('unlink', (path) => removeFile(path));
chokidar
  .watch(path.join(rootDir, 'src/client/'), { ignoreInitial: true })
  .on('unlink', (path) => removeFile(path));
buildAll().catch((err) => console.log(`Ошибка сборщика: ${err}`));
