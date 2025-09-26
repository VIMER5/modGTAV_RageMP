import { rm } from "fs/promises";

const Colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  reset: "\x1b[0m",
}

let ClearDir = {
  name: "ClearDir",
  setup(build) {
    build.onStart(async () => {
      try {
        let date = new Date();
        let timeStartBuild = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        let nameBuild = build.initialOptions.outbase.split('/')[1];
        console.log(`----------- [${timeStartBuild}] НОВЫЙ БИЛД [${nameBuild}]----------`)
        console.log(Colors.red + `- Очистка папки: ${build.initialOptions.outdir}` + Colors.reset);
        await rm(build.initialOptions.outdir, { recursive: true });
      } catch (err) {
        console.log(Colors.red + "Ошибка очистки: " + err + Colors.reset);
      }
    });
  },
};

let DoneBuild = {
  name: "DoneBuild",
  setup(build) {
    build.onEnd((result) => {
      console.log(Colors.yellow + "Билды: " + Colors.reset);
      for (let kay in result.metafile.outputs) {
        console.log(Colors.green + `+ ${kay}` + Colors.reset);
      }
      console.log(Colors.magenta + `Сборка завершилась с ${result.errors.length} ошибками` + Colors.reset);
    });
  },
};
export { ClearDir, DoneBuild };
