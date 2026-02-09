import React from "react";
import { Tooltip, Typography } from "@mui/material";
import { formatDistanceToNow, format, isValid } from "date-fns";

interface RelativeTimeTooltipProps {
  passedDate: string | Date | null | undefined;
  fontSize?: string | number;
}

const RelativeTimeTooltip: React.FC<RelativeTimeTooltipProps> = ({
  passedDate,
  fontSize,
}) => {
  const date = passedDate ? new Date(passedDate) : null;

  if (!date || !isValid(date)) {
    return (
      <Typography variant="body2" sx={{ fontSize }}>
        null
      </Typography>
    );
  }

  return (
    <Tooltip
      title={format(date, "PPP pp")}
      arrow
      theme-allow-standard-spacing="true"
    >
      <Typography
        variant="body2"
        sx={{
          cursor: "help",
          borderBottom: "1px dotted",
          display: "inline-block",
          borderColor: "text.secondary",
          fontSize,
        }}
      >
        {formatDistanceToNow(date, { addSuffix: true })}
      </Typography>
    </Tooltip>
  );
};

export default RelativeTimeTooltip;
