"use client";
import { store } from "@/store/store";
import VerifyUser from "@/sub-components/VerifyUser";
import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";

export default function Home() {
  const { user } = store();
  
  const homepage = (
    <Typography>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium
      assumenda, consectetur aliquid omnis, est, labore similique sapiente
      numquam unde voluptatum consequatur quae eum ea. Praesentium quia hic
      asperiores exercitationem repudiandae.
    </Typography>
  );

  if (user?.verified) return homepage;

  return (
    <>
      <div className="absolute z-50">
        <VerifyUser id={user?.id} />
      </div>
      <Box sx={{ filter: "blur(5px)" }}>{homepage}</Box>
    </>
  );
}
