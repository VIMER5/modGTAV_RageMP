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

const isWatch = process.argv.includes("--watch");
async function buildAll() {
  const server = await esbuild.context({
    entryPoints: ["src/server/src/**/*.ts"],
    outdir: outdir.server,
    outbase: "src/server/src/",
    platform: "node",
    format: "cjs",
    target: ["es2020"],
    sourcemap: false,
    bundle: false,
    ignoreAnnotations: false,
    metafile: true,
    plugins: [ClearDir, DoneBuild],
  });
  const client = await esbuild.context({
    entryPoints: ["src/client/src/**/*.ts"],
    outdir: outdir.client,
    outbase: "src/client/src/",
    platform: "node",
    format: "cjs",
    target: ["es2020"],
    sourcemap: false,
    bundle: false,
    ignoreAnnotations: false,
    metafile: true,
    plugins: [ClearDir, DoneBuild],
  });

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
