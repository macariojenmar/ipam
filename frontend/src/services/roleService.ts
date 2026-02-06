import type { PaginatedResponse } from "./api";
import api from "../services/api";
import { DEVELOPER, SUPER_ADMIN, USER } from "../enums/roleEnums";

export interface PermissionItem {
  id: string;
  name: string;
  roles: {
    [DEVELOPER]: boolean;
    [SUPER_ADMIN]: boolean;
    [USER]: boolean;
  };
}

export const getPermissions = async (
  page: number = 1,
  perPage: number = 10,
  search?: string,
): Promise<PaginatedResponse<PermissionItem>> => {
  const response = await api.get<PaginatedResponse<PermissionItem>>(
    "/permissions",
    {
      page,
      per_page: perPage,
      search,
    },
  );
  return response.data;
};

export const updatePermissionRole = async (
  permissionId: string,
  roleName: string,
  isEnabled: boolean,
): Promise<void> => {
  await api.put(`/permissions/update/${permissionId}`, {
    role: roleName,
    enabled: isEnabled,
  });
};

export const createPermission = async (
  name: string,
): Promise<PermissionItem> => {
  const response = await api.post<PermissionItem>("/permissions/create", {
    name,
  });
  return response.data as PermissionItem;
};
