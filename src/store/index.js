/**
 * @fileoverview
 * * Data layer — in-memory store for Step 1.
 * * Interface (function names + signatures) is intentionally stable.
 * * Later, we replace the internals with DynamoDB calls —
 * * nothing outside this file needs to change.
 * @author Ashish Karki
 *
 */
import { randomUUID } from 'crypto';

// Private store -- no exported
const store = new Map();

// Creates a new message record, assigns its ID here at birth.
// ID is always assigned at intake, never in the worker.
export const createMessage = ({ to, message }) => {
  const messageId = randomUUID();
  const now = new Date().toISOString();

  const record = {
    messageId,
    to,
    message,
    status: 'queued', // born as 'queued', worker will update when it gets picked
    retryCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  store.set(messageId, record);

  return record;
};

// fetch a single message by ID, return null if not found
export const getMessage = (messageId) => store.get(messageId) || null;

// Update status + any extra fields (sentAt, errorMessage etc.)
// Returns updated record, null if messageId doesn't exist
export const updateMessageStatus = (messageId, status, extraFields = {}) => {
  if (!store.has(messageId)) return null;

  const updatedRecord = {
    ...store.get(messageId),
    status,
    ...extraFields,
    updatedAt: new Date().toISOString(),
  };

  store.set(messageId, updatedRecord);

  return updatedRecord;
};

// Debugging only -- demp everything in the store
export const getAllMessages = () => Array.from(store.values());

// Caution -- clears the store
export const clearStore = () => store.clear();
