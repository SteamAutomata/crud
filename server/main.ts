import ViteExpress from "vite-express";
import { PrismaClient } from "@prisma/client";
import express, { IRoute } from "express";
import cors from "cors";
import { app, Handler, prisma } from "./globals";
import { userHandler } from "./handlers/user";
import { Response } from "express-serve-static-core";
import { postHandler } from "./handlers/post";

app.use(cors());
app.use(express.json());

// Permet de savoir quand un serveur reçoit une requête
app.use("/", (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

export function api(route: string) {
  return `/api${route}`;
}

/** Essayer d'exécuter le callback, répondre avec une erreur 500 en cas d'échet */
async function catchJson<T>(res: Response, callback: () => Promise<T>) {
  try {
    const result = await callback();
    res.json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}

function methodNotAllowed(req: any, res: any, next: any) {
  return res.status(405).send();
}

/** Opérations CRUD de base */
function crud(route: string, handler: Handler<any>) {
  // :id specific
  app
    .route(route + "/:id")
    .get((req, res) =>
      catchJson(res, () => handler.read(parseInt(req.params.id)))
    )
    .delete(async (req, res) =>
      catchJson(res, () => handler.delete(parseInt(req.params.id)))
    )
    .put(async (req, res) =>
      catchJson(res, () => handler.update(parseInt(req.params.id), req.body))
    )
    .all(methodNotAllowed);

  // plural
  app
    .route(route)
    .get(async (req, res) => catchJson(res, () => handler.list()))
    .post(async (req, res) => catchJson(res, () => handler.create(req.body)))
    .all(methodNotAllowed);
}

crud(api("/user"), userHandler);

app.route(api("/posts")).get(async (req, res) => {
  catchJson(res, () => postHandler.getPage(0));
});

app.route(api("/post")).post(async (req, res) => {
  try {
    const body = req.body;
    const userId = parseInt(body.userId);
    const respondingToId = parseInt(body.respondingToId);
    body.userId = undefined;
    body.respondingToId = undefined;

    console.log(body);
    await postHandler.createPost(body, userId, respondingToId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server is listening on port 3000..."));
