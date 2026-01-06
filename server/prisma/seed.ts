import dotenv from 'dotenv';
dotenv.config();
import prisma from '../src/utils/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const adminEmail = 'admin@marbleerp.local';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const password = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password,
        name: 'Admin',
        role: 'ADMIN',
      },
    });
    console.log('Seeded admin user');
  } else {
    console.log('Admin already exists');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

