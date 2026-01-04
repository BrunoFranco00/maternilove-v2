import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Criar usuário administrador
  const adminEmail = 'suporte@maternilove.com.br';
  const adminPassword = 'Materni%2026';

  // Verificar se admin já existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('⚠️  Admin user already exists. Updating...');
    
    // Atualizar senha e garantir que é admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        status: 'ACTIVE',
        emailVerified: true,
      },
    });
    
    console.log('✅ Admin user updated successfully!');
  } else {
    console.log('📝 Creating admin user...');
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrador Materni Love',
        role: UserRole.SUPER_ADMIN,
        status: 'ACTIVE',
        emailVerified: true,
        bio: 'Administrador principal da plataforma Materni Love',
      },
    });
    
    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}`);
  }

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

