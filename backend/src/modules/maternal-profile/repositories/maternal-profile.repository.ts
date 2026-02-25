import { PrismaClient } from '@prisma/client';
import {
  PregnancyStage,
  PregnancyType,
  ChildSex,
  ContentFocus,
  RiskFlag,
  MoodType,
} from '@prisma/client';
import { BaseRepository } from '../../../repositories/BaseRepository.js';

/** Tipos para upsert de cada seção */
export type MaternalPersonalDataInput = {
  fullName?: string | null;
  phone?: string | null;
  cpf?: string | null;
  birthDate?: Date | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

export type MaternalAddressInput = {
  postalCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

export type MaternalPregnancyInput = {
  stage?: PregnancyStage;
  dueDate?: Date | null;
  lastMenstrualPeriod?: Date | null;
  gestationalWeek?: number | null;
  gestationalDay?: number | null;
  pregnancyType?: PregnancyType | null;
  isHighRisk?: boolean | null;
  riskFlags?: RiskFlag[];
  preferredContentFocus?: ContentFocus[];
  locale?: string | null;
  timeZone?: string | null;
};

export type MaternalHealthInput = {
  conditions?: string[];
  medications?: string[];
  allergies?: string[];
  hasPrenatalCare?: boolean | null;
  prenatalCareNotes?: string | null;
};

export type MaternalLifestyleInput = {
  sleepQuality?: number | null;
  activityLevel?: number | null;
  nutritionFocus?: string | null;
  supplements?: string[];
};

export type MaternalEmotionalInput = {
  baselineMood?: MoodType | null;
  stressLevel?: number | null;
  supportNetwork?: number | null;
  notes?: string | null;
};

export type ChildProfileInput = {
  childName?: string | null;
  childSex?: ChildSex | null;
  birthDate?: Date | null;
  ageMonths?: number | null;
  notes?: string | null;
};

export class MaternalProfileRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /** Busca perfil materno completo agregado por userId */
  async findAggregatedByUserId(userId: string) {
    const [maternalProfile, personal, address, health, lifestyle, emotional, child] =
      await Promise.all([
        this.prisma.maternalProfile.findUnique({ where: { userId } }),
        this.prisma.maternalPersonalData.findUnique({ where: { userId } }),
        this.prisma.maternalAddress.findUnique({ where: { userId } }),
        this.prisma.maternalHealth.findUnique({ where: { userId } }),
        this.prisma.maternalLifestyle.findUnique({ where: { userId } }),
        this.prisma.maternalEmotional.findUnique({ where: { userId } }),
        this.prisma.childProfile.findUnique({ where: { userId } }),
      ]);

    return {
      pregnancy: maternalProfile,
      personal,
      address,
      health,
      lifestyle,
      emotional,
      child,
    };
  }

  /** Upsert em transação de todas as seções enviadas */
  async upsertInTransaction(
    userId: string,
    sections: {
      personal?: MaternalPersonalDataInput;
      address?: MaternalAddressInput;
      pregnancy?: MaternalPregnancyInput;
      health?: MaternalHealthInput;
      lifestyle?: MaternalLifestyleInput;
      emotional?: MaternalEmotionalInput;
      child?: ChildProfileInput;
    }
  ) {
    return this.prisma.$transaction(async (tx) => {
      if (sections.personal !== undefined) {
        await tx.maternalPersonalData.upsert({
          where: { userId },
          create: {
            userId,
            ...sections.personal,
          },
          update: sections.personal,
        });
      }
      if (sections.address !== undefined) {
        await tx.maternalAddress.upsert({
          where: { userId },
          create: {
            userId,
            ...sections.address,
          },
          update: sections.address,
        });
      }
      if (sections.pregnancy !== undefined) {
        await tx.maternalProfile.upsert({
          where: { userId },
          create: {
            userId,
            ...sections.pregnancy,
          },
          update: sections.pregnancy,
        });
      }
      if (sections.health !== undefined) {
        await tx.maternalHealth.upsert({
          where: { userId },
          create: {
            userId,
            ...sections.health,
          },
          update: sections.health,
        });
      }
      if (sections.lifestyle !== undefined) {
        await tx.maternalLifestyle.upsert({
          where: { userId },
          create: {
            userId,
            ...sections.lifestyle,
          },
          update: sections.lifestyle,
        });
      }
      if (sections.emotional !== undefined) {
        await tx.maternalEmotional.upsert({
          where: { userId },
          create: {
            userId,
            ...sections.emotional,
          },
          update: sections.emotional,
        });
      }
      if (sections.child !== undefined) {
        await tx.childProfile.upsert({
          where: { userId },
          create: {
            userId,
            ...sections.child,
          },
          update: sections.child,
        });
      }

      const [maternalProfile, personal, address, health, lifestyle, emotional, child] =
        await Promise.all([
          tx.maternalProfile.findUnique({ where: { userId } }),
          tx.maternalPersonalData.findUnique({ where: { userId } }),
          tx.maternalAddress.findUnique({ where: { userId } }),
          tx.maternalHealth.findUnique({ where: { userId } }),
          tx.maternalLifestyle.findUnique({ where: { userId } }),
          tx.maternalEmotional.findUnique({ where: { userId } }),
          tx.childProfile.findUnique({ where: { userId } }),
        ]);

      return {
        pregnancy: maternalProfile,
        personal,
        address,
        health,
        lifestyle,
        emotional,
        child,
      };
    });
  }

  /** Retorna dados mínimos para calcular status e contexto (sem precisar de transaction) */
  async findForStatusAndContext(userId: string) {
    const [maternalProfile, personal, health, lifestyle, emotional, child] =
      await Promise.all([
        this.prisma.maternalProfile.findUnique({ where: { userId } }),
        this.prisma.maternalPersonalData.findUnique({ where: { userId } }),
        this.prisma.maternalHealth.findUnique({ where: { userId } }),
        this.prisma.maternalLifestyle.findUnique({ where: { userId } }),
        this.prisma.maternalEmotional.findUnique({ where: { userId } }),
        this.prisma.childProfile.findUnique({ where: { userId } }),
      ]);
    return {
      maternalProfile,
      personal,
      health,
      lifestyle,
      emotional,
      child,
    };
  }
}
