// Routes — registers paths and HTTP verbs only.
// No logic here. If a route needs middleware later (e.g. auth),
// it gets added here without touching the handler.

import { Router } from 'express';
import {
  getMessageStatus,
  listAllMessages,
  sendMessage,
} from '../handlers/index.js';

const router = Router();

router.post('/send', sendMessage);
router.get('/:messageId/status', getMessageStatus);
router.get('/', listAllMessages); // debug endpoint — see all messages

export default router;
