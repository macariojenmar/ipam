import api, { type PaginatedResponse } from "./api";

export interface IpAddress {
  id: number;
  ip: string;
  type: "IPv4" | "IPv6";
  label: string;
  comment?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
}

export interface IpSaveData {
  id?: number;
  ip: string;
  type: string;
  label: string;
  comment?: string;
}

export const getIps = async (
  page: number = 1,
  perPage: number = 10,
  search?: string,
  type?: string,
) => {
  return api.get<PaginatedResponse<IpAddress>>("/ips", {
    page,
    per_page: perPage,
    search,
    type: type === "all" ? "" : type,
  });
};

export const createIpAddress = async (data: IpSaveData) => {
  return api.post("/ips/create", data);
};

export const updateIpAddress = async (id: number, data: IpSaveData) => {
  return api.put(`/ips/update/${id}`, data);
};

export const deleteIpAddress = async (id: number) => {
  return api.delete(`/ips/delete/${id}`);
};
