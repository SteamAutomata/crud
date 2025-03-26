import ViteExpress from "vite-express";
import { PrismaClient } from "@prisma/client";
import express, { IRoute, Request } from "express";
import cors from "cors";
import { app, Handler, Payload, prisma } from "./globals";
import { userHandler } from "./handlers/user";
import { Response } from "express-serve-static-core";
import { postHandler } from "./handlers/post";
import { hash } from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
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
function authMiddleware(req: Request & { payload: Payload }, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as string;
    req.payload = decoded as unknown as Payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
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

app
  .route(api("/post"))
  .post(async (req, res) => {
    try {
      const body = req.body;
      const userId = parseInt(body.userId);
      const respondingToId = parseInt(body.respondingToId);
      body.userId = undefined;
      body.respondingToId = undefined;

      await postHandler.createPost(body, userId, respondingToId);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .get(async (req, res) => {
    try {
      const id = parseInt(req.query.id as any);
      const data = await postHandler.getPostFromId(id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    select: { email: true, password: true, id: true },
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.listen(3000, () => console.log("Server is listening on port 3000..."));
