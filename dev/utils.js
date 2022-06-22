const isDev = process.env.NODE_ENV !== "production";
console.log(`use ${green(isDev ? "development" : "production")} version`);
export const BuildArgs = {
  entryPoints: ["./src/index.tsx"],
  ...(isDev || { entryNames: "[dir]/[name].[hash]" }),
  bundle: true,
  outdir: "./dist",
  minify: !isDev,
  sourcemap: isDev,
  // splitting: true,
  // chunkNames: 'chunks/[name].[hash]',
  format: "esm",
  // plugins: [mapOutputToEntry]
  metafile: true
};

export function colorful(str, color) {
  return `\x1b[${color}m${str}\x1b[0m`;
}
export function blue(str) {
  return colorful(str, 96);
}
export function green(str) {
  return colorful(str, 92);
}
export function red(str) {
  return colorful(str, 91);
}
