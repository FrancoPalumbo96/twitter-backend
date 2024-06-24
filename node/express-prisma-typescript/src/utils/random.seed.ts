import { PrismaClient, ReactionType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

async function main() {
  // Create mock users
  for (let i = 0; i < 5; i++) {
    const username = faker.internet.userName();
    const name = username.length >= 5 ? username.slice(0, 5) : username;
    const hashedPassword = await bcrypt.hash('Strong_Password_00', 10);
    const user = await prisma.user.create({
      data: {
        username: username,
        name: name,
        email: faker.internet.email(),
        password: hashedPassword,
        privateUser: faker.datatype.boolean(),
      },
    });

    // Create mock post for each user
    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        content: `This is a Post from ${username}`,
      },
    });

    // Generate rand reaction for each post
    await prisma.reaction.create({
      data: {
        postId: post.id,
        userId: user.id,
        type: faker.datatype.boolean()? ReactionType.LIKE : ReactionType.RETWEET
      },
    });
  }

  // Create mock follows
  const users = await prisma.user.findMany();
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      if (Math.random() > 0.5) {
        await prisma.follow.create({
          data: {
            followerId: users[i].id,
            followedId: users[j].id,
          },
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
