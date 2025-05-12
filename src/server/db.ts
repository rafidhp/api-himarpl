import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { env } from "@/env";

const adapter = new PrismaLibSQL({
  url: `${env.DATABASE_URL}`,
  authToken: `${env.TURSO_AUTH_TOKEN}`,
});

export const db = new PrismaClient({
  adapter,
  log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
