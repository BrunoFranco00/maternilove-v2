import { z } from 'zod';

// GET /feed - Query params
export const getFeedQuerySchema = z.object({
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

// POST /posts - Body
export const createPostBodySchema = z.object({
  content: z.string().min(1, 'Conteúdo do post é obrigatório').trim(),
  images: z.preprocess(
    (val) => (val === undefined || val === null ? [] : val),
    z.array(z.string().url('URL inválida')).default([])
  ),
});

// POST /posts/:id/like - Params
export const toggleLikeParamsSchema = z.object({
  id: z.string().min(1, 'ID do post é obrigatório'),
});

// POST /posts/:id/comments - Params e Body
export const createCommentParamsSchema = z.object({
  id: z.string().min(1, 'ID do post é obrigatório'),
});

export const createCommentBodySchema = z.object({
  text: z.string().min(1, 'Texto do comentário é obrigatório').trim(),
});

// GET /posts/:id/comments - Params e Query
export const getCommentsParamsSchema = z.object({
  id: z.string().min(1, 'ID do post é obrigatório'),
});

export const getCommentsQuerySchema = z.object({
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
      if (val === undefined || val === '') return 20;
      const num = parseInt(String(val), 10);
      return isNaN(num) ? 20 : num;
    },
    z.number().int().positive().max(100).default(20)
  ),
});
