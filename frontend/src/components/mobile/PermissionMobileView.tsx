import type { Dispatch, SetStateAction } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Switch,
  TablePagination,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Shield } from "lucide-react";
import type { PermissionItem } from "../../services/roleService";

interface PermissionMobileViewProps {
  permissions: PermissionItem[];
  loading: boolean;
  totalRows: number;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: Dispatch<SetStateAction<{ page: number; pageSize: number }>>;
  roles: string[];
  handleToggle: (permissionId: string, role: string, currentValue: boolean) => void;
}

export const PermissionMobileView = ({
  permissions,
  loading,
  totalRows,
  paginationModel,
  setPaginationModel,
  roles,
  handleToggle,
}: PermissionMobileViewProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ height: "100%", overflowY: "auto", pb: 2 }}>
      <Stack spacing={2}>
        {permissions.map((perm: PermissionItem) => (
          <Card
            key={perm.id}
            variant="outlined"
            sx={{ borderRadius: "12px" }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                mb={2}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    color: "primary.main",
                  }}
                >
                  <Shield size={18} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700} noWrap>
                  {perm.name}
                </Typography>
              </Stack>

              <Divider sx={{ mb: 2, borderStyle: "dashed" }} />

              <Stack spacing={1.5}>
                {roles.map((role: string) => {
                  const isChecked =
                    perm.roles[role as keyof typeof perm.roles];
                  return (
                    <Stack
                      key={role}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        p: 1.2,
                        borderRadius: "12px",
                        bgcolor: isChecked
                          ? alpha(theme.palette.success.main, 0.05)
                          : "action.hover",
                        border: "1px solid",
                        borderColor: isChecked
                          ? alpha(theme.palette.success.main, 0.1)
                          : "transparent",
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={
                          isChecked ? "success.main" : "text.secondary"
                        }
                      >
                        {role}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color={
                            isChecked ? "success.main" : "text.disabled"
                          }
                          sx={{ textTransform: "uppercase" }}
                        >
                          {isChecked ? "Enabled" : "Disabled"}
                        </Typography>
                        <Switch
                          checked={isChecked}
                          onChange={() =>
                            handleToggle(perm.id, role, isChecked)
                          }
                          size="small"
                          color="success"
                        />
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        ))}
        {permissions.length === 0 && !loading && (
          <Box py={4} textAlign="center">
            <Typography color="text.secondary">
              No permissions found
            </Typography>
          </Box>
        )}
      </Stack>
      <TablePagination
        component="div"
        count={totalRows}
        page={paginationModel.page}
        onPageChange={(_, newPage) =>
          setPaginationModel((prev) => ({ ...prev, page: newPage }))
        }
        rowsPerPage={paginationModel.pageSize}
        onRowsPerPageChange={(e) =>
          setPaginationModel((prev) => ({
            ...prev,
            pageSize: parseInt(e.target.value, 10),
            page: 0,
          }))
        }
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage={"Rows:"}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to}/${count}`
        }
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          mt: 1,
        }}
      />
    </Box>
  );
};
