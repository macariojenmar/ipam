import {
  Activity,
  UserPlus,
  LogOut,
  LogIn,
  RefreshCcw,
  Settings,
  Trash2,
  Lock,
} from "lucide-react";

export const getEventIcon = (event: string) => {
  if (event.includes("created")) return { icon: UserPlus, color: "#10b981" };
  if (event.includes("updated")) return { icon: RefreshCcw, color: "#3b82f6" };
  if (event.includes("deleted")) return { icon: Trash2, color: "#ef4444" };
  if (event.includes("login")) return { icon: LogIn, color: "#10b981" };
  if (event.includes("logout")) return { icon: LogOut, color: "#6b7280" };
  if (event.includes("role") || event.includes("permission"))
    return { icon: Lock, color: "#8b5cf6" };
  if (event.includes("status")) return { icon: Settings, color: "#f59e0b" };
  return { icon: Activity, color: "#6b7280" };
};
