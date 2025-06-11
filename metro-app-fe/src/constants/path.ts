export const FE_PATH = {
  ORIGIN: "http://localhost:3000",
  HOME: "/home",
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  ADMIN: "/admin",
  NEWS: "/blogs",
  NEWS_DETAIL: "/blogs/:id",
  USER: "/users",
  SOCIAL_LOGIN_REDIRECT: "/oauth2/redirect",
} as const;

export const API_PATH = {
  ORIGIN: "http://localhost:4003/api",
  GOOGLE_LOGIN: `http://localhost:4003/api/oauth2/authorize/google`,
  LOGOUT: '/auth/logout',
  LOCAL_LOGIN: '/auth/local-login',
  BLOG: "http://localhost:4007/api/v1/blogs",
} as const
