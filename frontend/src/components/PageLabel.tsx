import { Stack, Typography } from "@mui/material";

interface PageLabelProps {
  title: string;
  subTitle: string;
}

const PageLabel = ({ title, subTitle }: PageLabelProps) => {
  return (
    <Stack>
      <Typography variant="h4" fontWeight={800}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subTitle}
      </Typography>
    </Stack>
  );
};

export default PageLabel;
