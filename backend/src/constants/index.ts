/**
 * Application-wide constants.
 * Business rules and magic numbers should be documented here rather than hardcoded.
 */

/** API version prefix — Doc 09 Section 7 mandates versioning from day one */
export const API_VERSION = '/api/v1';

/** Supported image upload formats — Doc 05 Section 19 */
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/** Order ID prefix — visible in customer-facing Order IDs */
export const ORDER_ID_PREFIX = 'AAC';

/** Default pagination */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
