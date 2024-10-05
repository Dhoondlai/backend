import type { Application, Router } from "express";
import { ProductRouter } from "./product.route";

const _routes: Array<[string, Router]> = [["/product", ProductRouter]];

export const routes = (app: Application): void => {
  _routes.map((route) => {
    const [url, router] = route;
    return app.use("/api" + url, router);
  });
};
