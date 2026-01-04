import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/prisma.js';

async function main() {
  console.log('🌱 Starting seed...');

  // Criar usuário administrador
  const adminEmail = 'suporte@maternilove.com.br';
  const adminPassword = 'Materni%2026';

  // Hash da senha
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  // Usar UPSERT para garantir idempotência (anti-race condition)
  console.log('📝 Upserting admin user (idempotent)...');
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      // Atualizar apenas campos permitidos (não sobrescreve dados existentes desnecessariamente)
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      status: 'ACTIVE',
      emailVerified: true,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Administrador Materni Love',
      role: UserRole.SUPER_ADMIN,
      status: 'ACTIVE',
      emailVerified: true,
      bio: 'Administrador principal da plataforma Materni Love',
    },
  });
  
  console.log('✅ Admin user upserted successfully!');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   ID: ${admin.id}`);

  console.log('✨ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

