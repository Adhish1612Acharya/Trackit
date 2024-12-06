import React, { FC, useState } from "react";
import { Typography, Popover, Box, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ReasonField: FC<{ reason: string }> = ({ reason }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  return (
    <Box>
      {/* Truncated Reason with View More */}
      <div className="resonDiv flex">
        <Tooltip title={reason} arrow>
          <Typography
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "50px",
              display: "inline-block",
              cursor: "pointer",
            }}
          >
            {reason.split("").length > 6 ? reason.slice(0, 5) + "..." : reason}
          </Typography>
        </Tooltip>
        <IconButton
          onClick={handleOpen}
          size="small"
          sx={{ color: "primary.main", marginLeft: 1 }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </div>

      {/* Popover for Full Reason */}
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          "& .MuiPopover-paper": {
            padding: 2,
            maxWidth: "90vw",
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "background.paper",
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            wordBreak: "break-word",
            textAlign: "justify",
            maxWidth: "100%",
          }}
        >
          {reason}
        </Typography>
      </Popover>
    </Box>
  );
};

export default ReasonField;
