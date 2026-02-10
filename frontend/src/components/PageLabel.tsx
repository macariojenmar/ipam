import { Fragment } from "react";
import {
  Card,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { formatNumberCompact } from "../utils/stringHelper";
interface PageLabelProps {
  title: string;
  subTitle: string;
  children?: React.ReactNode;
  count?: number;
  loading?: boolean;
}

const PageLabel = ({
  title,
  subTitle,
  children,
  count,
  loading,
}: PageLabelProps) => {
  return (
    <Fragment>
      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        spacing={{ xs: 1, sm: 2 }}
      >
        <Grid size={{ xs: 12, md: "auto" }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={"center"}
            gap={1.5}
            justifyContent={{ xs: "center", md: "start" }}
          >
            {count !== undefined && (
              <Card
                variant="outlined"
                sx={{
                  minWidth: { xs: 60, md: 70 },
                  height: { xs: 50, md: 60 },
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Typography
                    textAlign={"center"}
                    variant="h5"
                    fontWeight={800}
                  >
                    {formatNumberCompact(count)}
                  </Typography>
                )}
              </Card>
            )}
            <Stack alignItems={{ xs: "center", md: "start" }}>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: { xs: "center", md: "left" } }}
              >
                {subTitle}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: "auto" }}>{children}</Grid>
      </Grid>
      <Divider sx={{ my: { xs: 2, sm: 3 } }} />
    </Fragment>
  );
};

export default PageLabel;
