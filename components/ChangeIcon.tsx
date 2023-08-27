"use client";
import { Avatar, IconButton } from "@mui/material";
import { useState } from "react";
import ModeIcon from "@mui/icons-material/Mode";

export default function ChangeIcon({ photo }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative"
    >
      <Avatar
        className={`w-full h-full ${hover && "opacity-50"}`}
        src={photo}
      />
      <IconButton
        className={`w-full h-full z-30 absolute top-0 opacity-0 transition-all  ${
          hover && "opacity-100"
        }`}
        color="info"
      >
        <ModeIcon sx={{ width: 40, height: 40 }} />
      </IconButton>
    </div>
  );
}
