import * as esbuild from "esbuild";
import envd from "dotenv";
import path from "path";
import { ClearDir, DoneBuild } from "./plugins.mjs";

envd.config({ debug: false });

const serverRootDir = process.env.SERVER_ROOT_DIR;
let outdir = {
  server: path.join(serverRootDir, "/packages"),
  client: path.join(serverRootDir, "/client_packages"),
};
function addContext(path, name) {
  return {
    entryPoints: [`src/${name}/**/*.ts`],
    outdir: path,
    outbase: `src/${name}/`,
    platform: "node",
    format: "cjs",
    target: ["es2020"],
    sourcemap: false,
    bundle: false,
    ignoreAnnotations: false,
    metafile: true,
    minify: false,
    charset: 'utf8',
    plugins: [ClearDir, DoneBuild],
  };
}
const isWatch = process.argv.includes("--watch");
async function buildAll() {
  const server = await esbuild.context(addContext(outdir.server, "server"));
  const client = await esbuild.context(addContext(outdir.client, "client"));

  if (isWatch) {
    await server.watch();
    await client.watch();
  } else {
    await server.rebuild();
    await client.rebuild();
    await server.dispose();
    await client.dispose();
  }
}
buildAll().catch((err) => console.log(`Ошибка сборщика: ${err}`));
