export const PageList = {
  DASHBOARD: "/dashboard",
  IP_MANAGEMENT: "/ip-management",
  USERS_MANAGEMENT: "/users-management",
} as const;

export type PageList = typeof PageList[keyof typeof PageList];
