// Explanation: the next line is part of program logic.
import multer from 'multer';
// Explanation: the next line is part of program logic.
import path from 'path';
// Explanation: the next line is part of program logic.
import fs from 'fs';
// Explanation: the next line is part of program logic.
import config from '../config/index.js';

// Explanation: the next line is part of program logic.
if (!fs.existsSync(config.uploadDir)) {
// Explanation: the next line is part of program logic.
  fs.mkdirSync(config.uploadDir, { recursive: true });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
const storage = multer.diskStorage({
// Explanation: the next line is part of program logic.
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
// Explanation: the next line is part of program logic.
  filename: (_req, file, cb) => {
// Explanation: the next line is part of program logic.
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
// Explanation: the next line is part of program logic.
    cb(null, `${unique}${path.extname(file.originalname)}`);
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
});

// Explanation: the next line is part of program logic.
export const upload = multer({
// Explanation: the next line is part of program logic.
  storage,
// Explanation: the next line is part of program logic.
  limits: { fileSize: config.maxUploadMb * 1024 * 1024 },
// Explanation: the next line is part of program logic.
  fileFilter: (_req, file, cb) => {
// Explanation: the next line is part of program logic.
    cb(null, /^(image|video)\//.test(file.mimetype));
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
});
