import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

dotenv.config();

const ADMIN_EMAIL = 'brunoff.agro@hotmail.com';
const NEW_PASSWORD = '123456';

async function resetAdminPassword() {
  try {
    console.log('🔍 Buscando usuário SUPER_ADMIN...');
    
    const existingUser = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
      select: { id: true, email: true, role: true },
    });

    if (!existingUser) {
      console.error(`❌ Erro: Usuário com email ${ADMIN_EMAIL} não encontrado`);
      process.exit(1);
    }

    console.log('🔐 Atualizando senha do SUPER_ADMIN...');
    
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
    
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    console.log('✅ Senha do SUPER_ADMIN atualizada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao atualizar senha do SUPER_ADMIN:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
