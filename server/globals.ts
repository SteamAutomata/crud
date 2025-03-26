import express from "express";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export const app = express();
export const prisma = new PrismaClient();

export interface Handler<T> {
  list(): Promise<T[]>;
  read(id: number): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  delete(id: any): Promise<any>;
  update(id: any, data: Partial<T>): Promise<T>;
}

export interface Payload extends JwtPayload {
  userId: string;
}
