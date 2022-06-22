import Koa from "koa";
import Router from "koa-router";
import proxy from "koa-proxies";
import fs from "fs";
import Mustache from "mustache";
import { serve } from "esbuild";
import * as u from "./utils.js";

let PORT = 8080;
const servedir = "/public";

export async function run() {
  // 启动esbuild服务器（不支持热更新HMR，每次请求都会重新build）
  const { port, host } = await serve(
    {
      host: "localhost",
      servedir
    },
    {
      ...u.BuildArgs,
      outdir: servedir
    }
  );
  console.assert(host && port, u.red(`esbuild serve error: ${host} ${port}`));
  console.log(`esbuild server is running at http://${host}:${port}`);

  const router = useRouter();

  const app = useServer([
    logger,
    router.routes(),
    proxy("/js", {
      target: `http://${host}:${port}`,
      rewrite: (path) => path.slice(3),
      logs: true
    }),
    router.allowedMethods()
  ]);

  const re = (server) => {
    server
      .on("error", (err) => {
        console.log(u.red(err.message));
        if (err.errno === -4091) {
          re(app.listen(++PORT));
        }
      })
      .on("listening", () => {
        console.log(`server is running at http://localhost:${PORT}`);
      });
  };
  re(app.listen(PORT));
}

/**
 * 请求打印中间件
 */
async function logger(ctx, next) {
  console.log(
    `${u.blue(ctx.method)} ${u.green(ctx.path)} ${ctx.headers["user-agent"]}`
  );
  await next();
}

/**
 * 配置路由
 */
function useRouter() {
  const router = new Router();

  router.get("/", async (ctx) => {
    const template = fs.readFileSync("./public/index.mustache", {
      encoding: "utf16le"
    });
    ctx.body = Mustache.render(template, { path: "js/index.js" });
  });
  router.get("/bvalg", async (ctx) => {
    console.log("bvalg");
  });
  return router;
}

/**
 * 配置服务器，注册中间件
 */
function useServer(middlewares) {
  const app = new Koa();

  middlewares.reduce((_, middleware) => app.use(middleware));

  return app;
}
