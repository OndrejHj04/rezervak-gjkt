"use client"
import { IconButton } from "@mui/material"
import FullscreenIcon from '@mui/icons-material/Fullscreen';

export default function ToggleFullscreen() {

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  };

  return (
    <IconButton onClick={toggleFullscreen}>
      <FullscreenIcon />
    </IconButton>
  )
}
