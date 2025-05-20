import winstonTimestampColorize from 'winston-timestamp-colorize';
import moment from 'moment';
import path from 'path';
import fs from 'fs';

import {
  createLogger,
  format as _format,
  transports as _transports,
} from 'winston';
import { getDirname } from './util.js';

const __dirname = getDirname(import.meta.url);
const { combine, timestamp, colorize, printf, splat } = _format;

// Ensure logs directory exists
const logsDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

const logFilePath = path.join(logsDirectory, 'app.log'); // Specify the path to the log file

const logger = createLogger({
  format: combine(
    splat(),
    timestamp({
      format: () => moment.utc().add(3, 'hours').format('YYYY-MM-DD HH:mm:ss') + ' EAT',
    }),
    colorize(),
    winstonTimestampColorize({ color: 'cyan' }),
    printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  level: 'debug',
  transports: [
    new _transports.Console({}),
    new _transports.File({ filename: logFilePath }), // Add the File transport
  ],
});

export default logger;
