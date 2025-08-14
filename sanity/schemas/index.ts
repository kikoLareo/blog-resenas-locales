// Export all schema types
import { city } from './city';
import { category } from './category';
import { venue } from './venue';
import { review } from './review';
import { post } from './post';

export const schemaTypes = [
  // Settings and configuration
  city,
  category,
  
  // Main content types
  venue,
  review,
  post,
];
