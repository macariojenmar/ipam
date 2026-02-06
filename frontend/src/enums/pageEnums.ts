export const PageList = {
  DASHBOARD: "/dashboard",
  IP_MANAGEMENT: "/ip-management",
  USERS_MANAGEMENT: "/users-management",
  ROLES_AND_PERMISSIONS: "/roles-and-permissions",
} as const;

export type PageList = (typeof PageList)[keyof typeof PageList];
