import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    neonConfig.webSocketConstructor = ws;
    const connectionString = `${process.env.DATABASE_URL}`;

    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    prisma = new PrismaClient({ adapter });
} else {
    let globalWithPrisma = global as typeof globalThis & {
        prisma: PrismaClient;
    };
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = new PrismaClient();
    }
    prisma = globalWithPrisma.prisma;
}

export default prisma;
