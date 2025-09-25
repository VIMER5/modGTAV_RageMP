import { rm } from "fs/promises";

const red = "\x1b[31m";
const green = "\x1b[32m";
const reset = "\x1b[0m";
const Yellow = "\x1b[33m";
const Magenta = "\x1b[35m";

let ClearDir = {
  name: "ClearDir",
  setup(build) {
    build.onStart(async () => {
      try {
        console.log(red + `- Очистка папки: ${build.initialOptions.outdir}` + reset);
        await rm(build.initialOptions.outdir, { recursive: true });
      } catch (err) {
        console.log(red + "Ошибка очистки: " + err + reset);
      }
    });
  },
};

let DoneBuild = {
  name: "DoneBuild",
  setup(build) {
    build.onEnd((result) => {
      console.log(Yellow + "Билды: " + reset);
      for (let kay in result.metafile.outputs) {
        console.log(green + `+ ${kay}` + reset);
      }
      console.log(Magenta + `сборка завершилась с ${result.errors.length} ошибками` + reset);
    });
  },
};
export { ClearDir, DoneBuild };
