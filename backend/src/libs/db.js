import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

export const db =
  globalForPrisma.prisma || 
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL, 
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}