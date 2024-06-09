import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllRows() {
    try {
      // Delete all rows from each table
      await prisma.follow.deleteMany();
      await prisma.post.deleteMany();
      await prisma.reaction.deleteMany();
      await prisma.user.deleteMany();
  
      console.log('All rows deleted successfully!');
    } catch (error) {
      console.error('Error deleting rows:', error);
    } finally {
      await prisma.$disconnect();
    }
  }

deleteAllRows();