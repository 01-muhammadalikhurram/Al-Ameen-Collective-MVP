import { z } from 'zod';

export const productItemSchema = z.object({
  product_code: z.string().min(1, 'Product code is required'),
  color: z.string().min(1, 'Color is required'),
  wholesale_price: z.coerce.number().min(0),
  additional_profit: z.coerce.number().min(0).default(0),
  // fileIndex corresponds to the index of the file in the uploaded files array,
  // or a string if no new file is uploaded
  fileIndex: z.coerce.number().optional(), 
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    summary_desc: z.string().optional(),
    fabric: z.string().min(1, 'Fabric is required'),
    category: z.string().min(1, 'Category is required'),
    season: z.string().min(1, 'Season is required'),
    items: z.array(productItemSchema).min(1, 'At least one variant is required'),
  })
});
