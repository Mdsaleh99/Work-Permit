import { PrismaClient } from "../generated/prisma/index.js"
import bcrypt from "bcryptjs"

const globalForPrisma = globalThis // In Node.js, globalThis refers to global. which is node.js global object

// console.log("global: ", global);
// console.log("globalThis: ", globalThis);
// console.log("this: ", this);

/** @type {import('../generated/prisma/index.js').PrismaClient} */
export const db = globalForPrisma.prisma || new PrismaClient().$extends({
    name: "userMethods",
    query: {
        user: {
            async create({ args, query }) {
                if (args.data.password) {
                    args.data.password = await bcrypt.hash(args.data.password, 10)
                }

                return query(args)
            }
        }
    }
})


if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db




/*

1. globalForPrisma.prisma || new PrismaClient()
    This ensures that only one PrismaClient instance exists during development.
    In Next.js or any hot-reload environment, if you don’t do this, every file reload will create a new PrismaClient() → leading to errors like:
    !Error: PrismaClient is already running
    So instead of making a new Prisma client each time, it reuses the one stored on globalThis.


2. if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
    This actually saves the client to globalThis during development.
    That way, when the file reloads, it finds an already existing Prisma client and doesn’t create multiple connections.
    In production, this isn’t needed because the server doesn’t hot-reload — it runs only once, so there’s no risk of multiple PrismaClient instances.

*/