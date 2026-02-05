import { Fragment } from "react";
import { Divider, Grid, Stack, Typography } from "@mui/material";
interface PageLabelProps {
  title: string;
  subTitle: string;
  children?: React.ReactNode;
}

const PageLabel = ({ title, subTitle, children }: PageLabelProps) => {
  return (
    <Fragment>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid>
          <Stack>
            <Typography variant="h4" fontWeight={800}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subTitle}
            </Typography>
          </Stack>
        </Grid>
        <Grid>{children}</Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
    </Fragment>
  );
};

export default PageLabel;
