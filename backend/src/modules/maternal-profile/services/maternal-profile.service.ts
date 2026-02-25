/**
 * Maternal Profile Service
 *
 * Organiza dados do perfil materno para personalização de conteúdo.
 * Não substitui orientação médica.
 */

import {
  PregnancyStage,
  PregnancyType,
  ChildSex,
  ContentFocus,
  RiskFlag,
  MoodType,
} from '@prisma/client';
import { MaternalProfileRepository } from '../repositories/maternal-profile.repository.js';

function toDate(v: string | undefined): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
}

function filterUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

export class MaternalProfileService {
  constructor(private repository: MaternalProfileRepository) {}

  private mapPatchBody(body: Record<string, unknown>) {
    const personal = body.personal as Record<string, unknown> | undefined;
    const address = body.address as Record<string, unknown> | undefined;
    const pregnancy = body.pregnancy as Record<string, unknown> | undefined;
    const health = body.health as Record<string, unknown> | undefined;
    const lifestyle = body.lifestyle as Record<string, unknown> | undefined;
    const emotional = body.emotional as Record<string, unknown> | undefined;
    const child = body.child as Record<string, unknown> | undefined;

    return {
      personal:
        personal && Object.keys(personal).length > 0
          ? filterUndefined({
              fullName: personal.fullName as string | undefined,
              phone: personal.phone as string | undefined,
              cpf: personal.cpf as string | undefined,
              birthDate: toDate(personal.birthDate as string | undefined),
              city: personal.city as string | undefined,
              state: personal.state as string | undefined,
              country: personal.country as string | undefined,
            })
          : undefined,
      address:
        address && Object.keys(address).length > 0
          ? filterUndefined({
              postalCode: address.postalCode as string | undefined,
              street: address.street as string | undefined,
              number: address.number as string | undefined,
              complement: address.complement as string | undefined,
              neighborhood: address.neighborhood as string | undefined,
              city: address.city as string | undefined,
              state: address.state as string | undefined,
              country: address.country as string | undefined,
            })
          : undefined,
      pregnancy:
        pregnancy && Object.keys(pregnancy).length > 0
          ? filterUndefined({
              stage: pregnancy.stage as PregnancyStage | undefined,
              dueDate: toDate(pregnancy.dueDate as string | undefined),
              lastMenstrualPeriod: toDate(
                pregnancy.lastMenstrualPeriod as string | undefined
              ),
              gestationalWeek: pregnancy.gestationalWeek as number | undefined,
              gestationalDay: pregnancy.gestationalDay as number | undefined,
              pregnancyType: pregnancy.pregnancyType as PregnancyType | undefined,
              isHighRisk: pregnancy.isHighRisk as boolean | undefined,
              riskFlags: pregnancy.riskFlags as RiskFlag[] | undefined,
              preferredContentFocus: pregnancy.preferredContentFocus as
                | ContentFocus[]
                | undefined,
              locale: pregnancy.locale as string | undefined,
              timeZone: pregnancy.timeZone as string | undefined,
            })
          : undefined,
      health:
        health && Object.keys(health).length > 0
          ? filterUndefined({
              conditions: health.conditions as string[] | undefined,
              medications: health.medications as string[] | undefined,
              allergies: health.allergies as string[] | undefined,
              hasPrenatalCare: health.hasPrenatalCare as boolean | undefined,
              prenatalCareNotes: health.prenatalCareNotes as string | undefined,
            })
          : undefined,
      lifestyle:
        lifestyle && Object.keys(lifestyle).length > 0
          ? filterUndefined({
              sleepQuality: lifestyle.sleepQuality as number | undefined,
              activityLevel: lifestyle.activityLevel as number | undefined,
              nutritionFocus: lifestyle.nutritionFocus as string | undefined,
              supplements: lifestyle.supplements as string[] | undefined,
            })
          : undefined,
      emotional:
        emotional && Object.keys(emotional).length > 0
          ? filterUndefined({
              baselineMood: emotional.baselineMood as MoodType | undefined,
              stressLevel: emotional.stressLevel as number | undefined,
              supportNetwork: emotional.supportNetwork as number | undefined,
              notes: emotional.notes as string | undefined,
            })
          : undefined,
      child:
        child && Object.keys(child).length > 0
          ? filterUndefined({
              childName: child.childName as string | undefined,
              childSex: child.childSex as ChildSex | undefined,
              birthDate: toDate(child.birthDate as string | undefined),
              ageMonths: child.ageMonths as number | undefined,
              notes: child.notes as string | undefined,
            })
          : undefined,
    };
  }

  async getStatus(userId: string) {
    const { maternalProfile, personal, health, lifestyle, emotional, child } =
      await this.repository.findForStatusAndContext(userId);

    const sections: Record<string, boolean> = {
      personal: !!(
        personal &&
        (personal.fullName ||
          personal.phone ||
          personal.cpf ||
          personal.birthDate ||
          personal.city)
      ),
      address: false, // simplified: não checamos address no status por ora
      pregnancy: !!(
        maternalProfile &&
        (maternalProfile.stage !== 'HAS_CHILD' ||
          maternalProfile.dueDate ||
          maternalProfile.gestationalWeek != null)
      ),
      health: !!(
        health &&
        (health.hasPrenatalCare != null ||
          health.conditions?.length ||
          health.medications?.length)
      ),
      lifestyle: !!(
        lifestyle &&
        (lifestyle.sleepQuality != null || lifestyle.activityLevel != null)
      ),
      emotional: !!(
        emotional &&
        (emotional.baselineMood ||
          emotional.stressLevel != null ||
          emotional.supportNetwork != null)
      ),
      child: !!(
        child &&
        (child.childName || child.childSex || child.birthDate || child.ageMonths != null)
      ),
    };

    const filled = Object.values(sections).filter(Boolean).length;
    const total = 7;
    const completedScore = Math.round((filled / total) * 100);

    const missingCritical: string[] = [];
    if (!maternalProfile?.stage) missingCritical.push('Estágio gestacional');
    if (!sections.personal && !personal) missingCritical.push('Dados pessoais básicos');

    return {
      completedScore,
      missingCritical,
      stage: maternalProfile?.stage ?? 'HAS_CHILD',
      hasChildProfile: sections.child,
      hasHealth: sections.health,
      hasLifestyle: sections.lifestyle,
      hasEmotional: sections.emotional,
      hasPersonal: sections.personal,
    };
  }

  async getProfile(userId: string) {
    return this.repository.findAggregatedByUserId(userId);
  }

  async patchProfile(userId: string, body: Record<string, unknown>) {
    const sections = this.mapPatchBody(body);
    return this.repository.upsertInTransaction(userId, sections);
  }

  async getContext(userId: string) {
    const { maternalProfile, emotional } =
      await this.repository.findForStatusAndContext(userId);

    const stage = maternalProfile?.stage ?? 'HAS_CHILD';
    const gestationalWeek = maternalProfile?.gestationalWeek ?? undefined;
    const gestationalDay = maternalProfile?.gestationalDay ?? undefined;
    const contentFocus =
      (maternalProfile?.preferredContentFocus?.length ?? 0) > 0
        ? maternalProfile!.preferredContentFocus!
        : this.inferContentFocus(stage, gestationalWeek);
    const riskFlags = maternalProfile?.riskFlags ?? [];
    const isHighRisk = maternalProfile?.isHighRisk ?? false;

    const recommendedTone = this.recommendTone(emotional?.baselineMood, emotional?.stressLevel);

    return {
      stage,
      gestationalWeek,
      gestationalDay,
      contentFocus,
      riskFlags,
      isHighRisk,
      recommendedTone,
    };
  }

  private inferContentFocus(
    stage: PregnancyStage,
    gestationalWeek?: number | null
  ): ContentFocus[] {
    if (stage === 'TRYING') return ['GENERAL'];
    if (stage === 'PREGNANT') {
      if (gestationalWeek != null && gestationalWeek < 13) return ['PREGNANCY', 'GENERAL'];
      if (gestationalWeek != null && gestationalWeek >= 37) return ['PREGNANCY', 'POSTPARTUM', 'GENERAL'];
      return ['PREGNANCY', 'GENERAL'];
    }
    if (stage === 'POSTPARTUM') return ['POSTPARTUM', 'NEWBORN', 'GENERAL'];
    return ['GENERAL'];
  }

  private recommendTone(
    baselineMood?: MoodType | null,
    stressLevel?: number | null
  ): 'suave' | 'neutro' | 'objetivo' {
    if (stressLevel != null && stressLevel >= 4) return 'suave';
    if (baselineMood === 'ANXIOUS' || baselineMood === 'OVERWHELMED') return 'suave';
    if (baselineMood === 'SAD') return 'suave';
    if (stressLevel != null && stressLevel <= 2) return 'objetivo';
    return 'neutro';
  }
}
