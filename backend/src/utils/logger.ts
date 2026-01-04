import winston from 'winston';

// Configurar transports baseado no ambiente
const transports: winston.transport[] = [];

if (process.env.NODE_ENV === 'production') {
  // Em produção (Railway): apenas console (stdout/stderr)
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
    })
  );
} else {
  // Em desenvolvimento: console colorido + arquivos
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
  
  // Tentar criar arquivos de log (pode falhar se diretório não existir)
  try {
    transports.push(
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' })
    );
  } catch (error) {
    // Ignorar erro se diretório logs/ não existir
    console.warn('Could not create log files, using console only');
  }
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'maternilove-backend' },
  transports,
});

export default logger;
