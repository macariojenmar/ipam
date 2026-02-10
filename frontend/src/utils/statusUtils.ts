import { ACTIVE, PENDING, REJECTED, ARCHIVED } from "../enums/statusEnums";

export const getStatusColor = (status: string): "success" | "warning" | "error" | "default" => {
  switch (status) {
    case ACTIVE:
      return "success";
    case PENDING:
      return "warning";
    case REJECTED:
    case ARCHIVED:
      return "error";
    default:
      return "default";
  }
};
