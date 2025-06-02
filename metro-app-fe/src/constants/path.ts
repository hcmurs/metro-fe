export const FE_PATH = {
  ORIGIN: "http://localhost:3000",
  HOME: "/home",
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  ADMIN: "/admin",
  NEWS: "/news",
  NEWS_DETAIL: "/news/:id",
  USER: "/users",
  SOCIAL_LOGIN_REDIRECT: "/oauth2/redirect",
} as const;

export const API_PATH = {
  ORIGIN: "http://localhost:8082/api/v1",
  GOOGLE_LOGIN: "http://localhost:8081/api/v1/oauth2/authorize/google",
} as const
