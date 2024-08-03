const basePath = "/api";
export const backendRoutes = {
  login: `${basePath}/sessions`,
  userDetails: `${basePath}/me`,
  tasks:`${basePath}/tasks`
} as const;
