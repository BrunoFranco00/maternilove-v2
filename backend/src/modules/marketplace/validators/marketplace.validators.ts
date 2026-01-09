import { z } from 'zod';

// GET /products - Query params
export const getProductsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.preprocess(
    (val) => {
      if (val === undefined || val === '') return 1;
      const num = parseInt(String(val), 10);
      return isNaN(num) ? 1 : num;
    },
    z.number().int().positive().default(1)
  ),
  limit: z.preprocess(
    (val) => {
      if (val === undefined || val === '') return 12;
      const num = parseInt(String(val), 10);
      return isNaN(num) ? 12 : num;
    },
    z.number().int().positive().max(100).default(12)
  ),
});

// GET /products/:id - Params
export const getProductParamsSchema = z.object({
  id: z.string().min(1, 'ID do produto é obrigatório'),
});

// POST /products/:id/reviews - Params e Body
export const createReviewParamsSchema = z.object({
  id: z.string().min(1, 'ID do produto é obrigatório'),
});

export const createReviewBodySchema = z.object({
  rating: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().min(1, 'Rating deve ser entre 1 e 5').max(5, 'Rating deve ser entre 1 e 5')
  ),
  text: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() ? val.trim() : null),
    z.string().nullable().optional().default(null)
  ),
});

// POST /orders - Body
export const createOrderBodySchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1, 'productId é obrigatório'),
      quantity: z.preprocess(
        (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
        z.number().int().min(1, 'quantity deve ser maior que 0')
      ),
    })
  ).min(1, 'Items são obrigatórios'),
});

// GET /orders - Sem validação (apenas autenticação)
