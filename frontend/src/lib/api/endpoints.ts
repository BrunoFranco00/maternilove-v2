export const API_ENDPOINTS = {
  AUTH: {
    SESSION: '/auth/session',
  },
  ADMIN: {
    USERS: '/admin/users',
    USER_ROLE: (userId: string) => `/admin/users/${userId}/role`,
    FLAGS: '/admin/flags',
    FLAG: (key: string) => `/admin/flags/${key}`,
  },
  CORE: {
    CHECK_IN: '/core/check-in',
    RELIEF: (id: string) => `/core/relief/${id}`,
  },
} as const;
