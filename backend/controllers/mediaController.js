// Explanation: the next line is part of program logic.
import * as mediaService from '../services/mediaService.js';

// Explanation: the next line is part of program logic.
export async function getMedia(req, res) {
// Explanation: the next line is part of program logic.
  const media = await mediaService.listMedia(req.user.id);
// Explanation: the next line is part of program logic.
  return res.json({ media });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function uploadMedia(req, res) {
// Explanation: the next line is part of program logic.
  if (!req.file) {
// Explanation: the next line is part of program logic.
    return res.status(400).json({ error: 'File required (image or video)' });
// Explanation: the next line is part of program logic.
  }

// Explanation: the next line is part of program logic.
  const media = await mediaService.saveMedia(req.user.id, req.file);
// Explanation: the next line is part of program logic.
  return res.status(201).json({ media });
// Explanation: the next line is part of program logic.
}
