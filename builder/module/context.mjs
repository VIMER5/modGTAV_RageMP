import path from 'path';
import { DoneBuild } from './plugins.mjs';
export default function context(outdir, name, rootDir) {
  const entryPoints = path.join(rootDir, `builder/temp/${name}`);
  return {
    entryPoints: [`${entryPoints}/**/*.js`],
    outdir: outdir,
    outbase: entryPoints,
    platform: 'node',
    format: 'cjs',
    target: ['es2020'],
    sourcemap: false,
    bundle: false,
    ignoreAnnotations: false,
    metafile: true,
    minify: false,
    charset: 'utf8',
    plugins: [DoneBuild],
  };
}
