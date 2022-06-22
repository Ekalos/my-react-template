import { build } from "esbuild";
import Mustache from "mustache";
import fs from "fs";
import * as u from "./utils.js";
//#region
// const mapOutputToEntry = {
//   name: 'mapOutputToEntry',
//   setup(build) {
//     build.onEnd(result => {
//       const ob = {}
//       Object.keys(result?.metafile?.outputs || {}).forEach(file => {
//         const {entryPoint} = result.metafile.outputs[file]
//         if (entryPoint) ob[entryPoint] = file
//       })

//       result.outputMap = ob
//     })
//   }
// }
//#endregion

export async function buildFile() {
  //编译主文件
  const { metafile } = await build(u.BuildArgs);

  console.log("\r⚡⚡⚡ Build complete!");

  //获取生成文件名
  const scriptName = Object.keys(metafile.outputs)[0].split("/").pop();
  console.assert(scriptName, u.red("script name is empty"));
  // console.log(`script name: ${u.blue(scriptName)}`);

  //生成html文件
  const template = fs.readFileSync("./public/index.mustache", {
    encoding: "utf16le"
  });
  console.assert(template, "index.mustache 读取失败");
  const html = Mustache.render(template, { path: scriptName });
  console.assert(html, "index.html 生成失败");
  fs.writeFileSync("./dist/index.html", html, { encoding: "utf16le" });
  // process.exit();
}
