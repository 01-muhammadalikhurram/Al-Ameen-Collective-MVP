/**
 * Frontend constants.
 */

// We proxy /api to the backend in development (vite.config.ts)
// In production, this might point to a fully qualified domain.
export const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const APP_NAME = 'Al Ameen Collective';
