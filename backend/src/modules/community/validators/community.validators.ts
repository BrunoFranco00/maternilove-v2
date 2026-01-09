import { z } from 'zod';

// GET /categories - Sem validação necessária (sem query params obrigatórios)

// GET /posts - Query params
export const getPostsQuerySchema = z.object({
  categoryId: z.string().optional(),
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
      if (val === undefined || val === '') return 10;
      const num = parseInt(String(val), 10);
      return isNaN(num) ? 10 : num;
    },
    z.number().int().positive().max(100).default(10)
  ),
});

// GET /posts/:id - Params
export const getPostParamsSchema = z.object({
  id: z.string().min(1, 'ID do post é obrigatório'),
});

// POST /posts - Body
export const createPostBodySchema = z.object({
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  title: z.string().min(1, 'Título é obrigatório').trim(),
  content: z.string().min(1, 'Conteúdo é obrigatório').trim(),
});

// POST /posts/:id/comments - Params e Body
export const createCommentParamsSchema = z.object({
  id: z.string().min(1, 'ID do post é obrigatório'),
});

export const createCommentBodySchema = z.object({
  text: z.string().min(1, 'Texto do comentário é obrigatório').trim(),
});
