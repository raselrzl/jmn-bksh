import { PrismaClient } from "@prisma/client";

// Create a singleton function to ensure only one instance of Prisma is used
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Declare global types for Prisma client (for TypeScript support)
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize the prisma client (check if it's already created globally)
const prisma = globalThis.prisma ?? prismaClientSingleton();

// Only assign globalThis.prisma in development to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
