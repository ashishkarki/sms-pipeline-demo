// Handlers — own the request/response cycle.
// Calls validation first, then the store.
// No business logic lives here — just orchestration.

import { createMessage, getAllMessages, getMessage } from '../store/index.js';
import { validateSendRequest } from '../validation/index.js';

// POST /messages/send
// Validates input, creates a queued record, returns 202.
export const sendMessage = (req, res) => {
  const { to, message } = req.body;
  const { valid, errors } = validateSendRequest({ to, message });

  if (!valid) {
    return res.status(400).json({ errors });
  }

  const messageRecord = createMessage({ to, message });

  console.log(`[HANDLER] Queued: ${messageRecord.messageId} → ${to}`);

  // 202 Accepted — not 200 OK.
  // Delivery hasn't happened yet. Client should poll /status to track.
  return res.status(202).json({
    messageId: messageRecord.messageId,
    status: messageRecord.status,
    note: 'Message accepted and queued for delivery..',
  });
};

// GET /messages/:messageId/status
// Simple status check — client polls this after sending.
export const getMessageStatus = (req, res) => {
  const { messageId } = req.params;
  const record = getMessage(messageId);

  if (!record) {
    return res.status(404).json({ error: `Message '${messageId}' not found` });
  }

  // Return a shaped response — not the raw record.
  // Client gets what they need, internal structure stays private.
  // When DynamoDB adds extra internal fields later, this doesn't leak them.
  return res.json({
    messageId: record.messageId,
    status: record.status,
    retryCount: record.retryCount,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
};

// GET /messages
// Debug only — lists everything in the store.
// Useful now, would be removed or auth-gated in production.
export const listAllMessages = (req, res) => {
  return res.json(getAllMessages());
};
