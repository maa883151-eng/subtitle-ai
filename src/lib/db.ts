import { PrismaClient } from "@prisma/client";
import { createDemoDb } from "./demo-data";

const isDemoMode = process.env.DEMO_MODE === "true";
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const db = isDemoMode
  ? (createDemoDb() as unknown as PrismaClient)
  : (globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] }));

if (!isDemoMode && process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
