// src/utils/courseAliases.js

/**
 * Returns all possible course codes in the DB for a given course.
 * For example, Labour Law may be stored as 'PUL 303' or 'BUL 305'.
 * Family Law may be stored as 'JPL 303' or 'JPL 305'.
 */
export function getLookupCourseCodes(code) {
  if (!code) return [];
  const upper = String(code).trim().toUpperCase();
  if (upper === 'BUL 305' || upper === 'PUL 303') {
    return ['BUL 305', 'PUL 303'];
  }
  if (upper === 'JPL 305' || upper === 'JPL 303') {
    return ['JPL 305', 'JPL 303'];
  }
  return [upper];
}

/**
 * Expands a list of course codes so questions and readings for aliased courses
 * are completely included.
 */
export function expandCourseCodes(codes = []) {
  const result = new Set();
  codes.forEach(c => {
    getLookupCourseCodes(c).forEach(resolved => result.add(resolved));
  });
  return Array.from(result);
}
