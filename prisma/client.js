// Import Prisma Client from Prisma JS Client
import { PrismaClient } from '@prisma/client'

// Create a singleton Prisma Client instance
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Check if we have a client in global scope
// If yes, reuse it, if not, create a new instance
const prisma = globalThis.prisma ?? prismaClientSingleton()

// Export Prisma Client instance
export default prisma

// In dev environment, update global scope
// To enable hot reloading of data model
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma