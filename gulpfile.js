import gulp from "gulp";
import gulp_clean from "gulp-clean";
import { buildFile } from "./dev/builder.js";
import { run } from "./dev/server.js";

export const clean = () => {
  return gulp.src("dist", { read: false, allowEmpty: true }).pipe(gulp_clean());
};

const build = () => {
  return buildFile();
};

export const start = () => {
  run();
};

const _ = gulp.series(clean, build);
export default _;
