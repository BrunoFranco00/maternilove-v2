import { JourneyRepository } from '../repositories/journey.repository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ErrorCode } from '../../../shared/errors/ErrorCatalog.js';

export class JourneyService {
  constructor(private repository: JourneyRepository) {}

  /**
   * Criar jornada
   */
  async createJourney(userId: string, data: { type: string; startDate: string | Date; expectedDate?: string | Date | null }) {
    // Verificar se usuário já tem jornada (userId é unique)
    const existingJourney = await this.repository.findByUserId(userId);
    if (existingJourney) {
      throw new AppError(ErrorCode.DUPLICATE_ENTRY, 'Você já possui uma jornada ativa');
    }

    // Converter startDate
    const startDate = typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate;
    
    // Converter expectedDate se fornecido
    const expectedDate = data.expectedDate
      ? typeof data.expectedDate === 'string'
        ? new Date(data.expectedDate)
        : data.expectedDate
      : null;

    // Validar datas
    if (isNaN(startDate.getTime())) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Data de início inválida');
    }

    if (expectedDate && isNaN(expectedDate.getTime())) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Data esperada inválida');
    }

    if (expectedDate && expectedDate < startDate) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Data esperada não pode ser anterior à data de início');
    }

    // Criar jornada
    const journey = await this.repository.create({
      userId,
      type: data.type,
      startDate,
      expectedDate,
    });

    return journey;
  }

  /**
   * Listar jornadas do usuário
   */
  async getJourneys(userId: string) {
    const journeys = await this.repository.findByUser(userId);
    return journeys;
  }
}
