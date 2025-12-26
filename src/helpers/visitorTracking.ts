/**
 * Visitor tracking utilities for analytics
 * Uses UUID v4 stored in localStorage to identify unique visitors
 */

/**
 * Gets or creates a visitor ID
 * If one exists in localStorage, returns it
 * Otherwise generates a new UUID v4 and stores it
 */
export const getOrCreateVisitorId = (): string => {
  const key = 'visitor_id';
  const existingId = localStorage.getItem(key);

  if (existingId) {
    return existingId;
  }

  // Generate UUID v4 (RFC4122 compliant)
  const newId = crypto.randomUUID();
  localStorage.setItem(key, newId);
  return newId;
};

/**
 * Gets the current visitor ID from localStorage
 * Returns null if no visitor ID exists yet
 */
export const getVisitorId = (): string | null => {
  return localStorage.getItem('visitor_id');
};
