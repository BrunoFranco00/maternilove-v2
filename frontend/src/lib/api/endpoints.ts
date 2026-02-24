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
    CHECK_IN: '/checkin',
    CHECKIN_LATEST: '/checkin/latest',
    CHECKIN_HISTORY: '/checkin',
  },
} as const;
