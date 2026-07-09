require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { username: 'admin' },
  });

  if (!existingUser) {
    const password_hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        password_hash,
        todos: {
          create: [
            {
              title: 'Học Prisma',
              description: 'Tìm hiểu cách sử dụng Prisma ORM trong NodeJS',
              is_completed: false,
            },
            {
              title: 'Làm bài Test',
              description: 'Hoàn thành các yêu cầu của bài test Intern',
              is_completed: true,
            },
          ],
        },
      },
    });
    console.log('Seeded database with user: admin');
  } else {
    console.log('Seed data already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
