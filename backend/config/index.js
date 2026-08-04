// Explanation: the next line is part of program logic.
import dotenv from 'dotenv';
// Explanation: the next line is part of program logic.
import path from 'path';
// Explanation: the next line is part of program logic.
import { fileURLToPath } from 'url';

// Explanation: the next line is part of program logic.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Explanation: the next line is part of program logic.
const rootDir = path.join(__dirname, '..');

// Explanation: the next line is part of program logic.
dotenv.config({ path: path.join(rootDir, '.env') });

// Explanation: the next line is part of program logic.
const config = {
// Explanation: the next line is part of program logic.
  port: Number(process.env.PORT ?? 4000),
// Explanation: the next line is part of program logic.
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
// Explanation: the next line is part of program logic.
  nodeEnv: process.env.NODE_ENV ?? 'development',
// Explanation: the next line is part of program logic.
  uploadDir: path.resolve(rootDir, process.env.UPLOAD_DIR ?? 'uploads'),
// Explanation: the next line is part of program logic.
  logDir: path.resolve(rootDir, process.env.LOG_DIR ?? 'logs'),
// Explanation: the next line is part of program logic.
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? 50),
// Explanation: the next line is part of program logic.
  jwt: {
// Explanation: the next line is part of program logic.
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
// Explanation: the next line is part of program logic.
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
// Explanation: the next line is part of program logic.
    accessExpires: process.env.JWT_ACCESS_EXPIRES ?? '15m',
// Explanation: the next line is part of program logic.
    refreshExpires: process.env.JWT_REFRESH_EXPIRES ?? '7d',
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
  databaseUrl: process.env.DATABASE_URL,
// Explanation: the next line is part of program logic.
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/unified_portal',
// Explanation: the next line is part of program logic.
};

// Explanation: the next line is part of program logic.
export default config;
