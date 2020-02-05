import "reflect-metadata";
import {createConnection} from "typeorm";
import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";
import * as cors from '@koa/cors';
import {AppRoutes} from "./routes";

// create connection with database (lazy)
createConnection().then(async connection => {

    const port = 3000
    // create koa app
    const app = new Koa();
    const router = new Router();

    // register all application routes
    AppRoutes.forEach(route => router[route.method](route.path, route.action));

    // run app
    app.use(cors());
    app.use(bodyParser());
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.listen(port);

    console.log(`Koa application is up and running on port ${port}`);

}).catch(error => console.log("TypeORM connection error: ", error));