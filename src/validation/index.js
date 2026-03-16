/**
 * @fileoverview
 * * Validation layer - pure functions only, no express or aws etc
 * * This same logic will run inside Lambda later - no changes needed
 * @author Ashish Karki
 * @param takes raw input, returns {valid, errors}
 */
const E164_REGEX = /^\+[1-9]\d{7,14}$/;
const MAX_LENGTH = 1530; // 10 concatenated SMS segments max

export const validateSendRequest = ({ to, message }) => {
  const errors = [];

  if (!to) {
    errors.push("'to' is required");
  } else if (!E164_REGEX.test(to)) {
    errors.push("'to' must be E.164 format e.g. +61412345678");
  }

  if (!message) {
    errors.push("'message' is required");
  } else if (message.trim().length === 0) {
    errors.push("'message' cannot be empty");
  } else if (message.length > MAX_LENGTH) {
    errors.push(`'message' cannot exceed ${MAX_LENGTH} characters`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
