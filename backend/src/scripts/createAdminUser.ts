import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'brunoff.agro@hotmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Materni%2026';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';

async function createAdminUser() {
  try {
    console.log('🔍 Verificando se usuário ADMIN já existe...');
    
    const existingUser = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
      select: { id: true, email: true, role: true },
    });

    if (existingUser) {
      if (existingUser.role !== 'SUPER_ADMIN') {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: 'SUPER_ADMIN' },
        });
      }
      console.log('✅ Admin já existia, role garantida');
      return;
    }

    console.log('🔨 Criando novo usuário SUPER_ADMIN...');
    
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: ADMIN_NAME,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    console.log('✅ Usuário SUPER_ADMIN criado com sucesso!');
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Nome: ${adminUser.name}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Criado em: ${adminUser.createdAt.toISOString()}`);
  } catch (error) {
    console.error('❌ Erro ao criar usuário ADMIN:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
