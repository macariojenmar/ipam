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
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1.5}
            justifyContent={"center"}
          >
            {count !== undefined && (
              <Card
                variant="outlined"
                sx={{
                  minWidth: 70,
                  height: 60,
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} />
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
            <Stack>
              <Typography variant="h4" fontWeight={800}>
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {subTitle}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid>{children}</Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
    </Fragment>
  );
};

export default PageLabel;
