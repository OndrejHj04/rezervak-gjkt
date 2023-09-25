"use client";
import { Avatar, IconButton } from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";
import { useState } from "react";

export default function ChangeAvatar() {
  const [hover, setHover] = useState(false);

  return (
    <IconButton
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ModeIcon
        sx={{
          width: 50,
          height: 50,
          position: "absolute",
          zIndex: 100,
          opacity: hover ? 1 : 0,
          color: "primary.main",
        }}
      />
      <Avatar sx={{ width: 100, height: 100, opacity: hover ? 0.6 : 1 }} />
    </IconButton>
  );
}
