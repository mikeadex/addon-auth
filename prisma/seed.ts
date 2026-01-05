import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'System Administrator',
          theme: 'dark',
        },
      },
    },
  });

  console.log('Created admin user:', admin.email);

  // Create Regular User
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: hashedPassword,
      role: Role.USER,
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'Just a regular user',
        },
      },
    },
  });

  console.log('Created regular user:', user.email);

  // Create Moderator User
  const moderator = await prisma.user.upsert({
    where: { email: 'moderator@example.com' },
    update: {},
    create: {
      email: 'moderator@example.com',
      name: 'Moderator User',
      password: hashedPassword,
      role: Role.MODERATOR,
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'Content Moderator',
        },
      },
    },
  });

  console.log('Created moderator user:', moderator.email);

  // Create audit log entries
  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'ACCOUNT_CREATED',
        resource: 'User',
        resourceId: admin.id,
        details: { method: 'seed' },
      },
      {
        userId: user.id,
        action: 'ACCOUNT_CREATED',
        resource: 'User',
        resourceId: user.id,
        details: { method: 'seed' },
      },
      {
        userId: moderator.id,
        action: 'ACCOUNT_CREATED',
        resource: 'User',
        resourceId: moderator.id,
        details: { method: 'seed' },
      },
    ],
  });

  console.log('Created audit log entries');
  console.log('\n✅ Database seeded successfully!');
  console.log('\nTest Credentials:');
  console.log('─────────────────────────────────────');
  console.log('Admin:     admin@example.com / password123');
  console.log('User:      user@example.com / password123');
  console.log('Moderator: moderator@example.com / password123');
  console.log('─────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
