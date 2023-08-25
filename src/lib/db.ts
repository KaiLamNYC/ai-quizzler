import { PrismaClient } from "@prisma/client";
import "server-only";

//https://www.prisma.io/docs/concepts/components/prisma-client#1-prerequisites

declare global {
	var cachedPrisma: PrismaClient;
}

export let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	if (!global.cachedPrisma) {
		global.cachedPrisma = new PrismaClient();
	}
	prisma = global.cachedPrisma;
}
