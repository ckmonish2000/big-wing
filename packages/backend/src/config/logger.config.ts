import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const loggerConfig = (): WinstonModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  });

  const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike('BigWing', {
        prettyPrint: true,
        colors: !isProduction,
      }),
    ),
  });

  return {
    transports: [
      consoleTransport,
      ...(isProduction ? [fileRotateTransport] : []),
    ],
    // Handles uncaught exceptions
    handleExceptions: true,
    exitOnError: false,
  };
};
