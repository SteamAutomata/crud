import ViteExpress from "vite-express";
import { PrismaClient } from "@prisma/client";
import express from "express";

export const app = express();
export const prisma = new PrismaClient();

export function api(route: string) {
  return `/api${route}`;
}

// GET /api/users
app.get(api("/users"), async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      avatar: true,
      name: true,
      role: true,
    },
    take: 10,
  });

  res.send(JSON.stringify(users));
});

// POST /api/users
app.post(api("/users"), async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });

  res.send(JSON.stringify(user));
});

// GET /api/users/:id
app.get(api("/users/:id"), async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  res.send(JSON.stringify(user));
});

// DELETE /api/users/:id
app.delete(api("/users/:id"), async (req, res) => {
  await prisma.user.delete({
    where: { id: parseInt(req.params.id) },
  });

  res.send(JSON.stringify({ success: true }));
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
