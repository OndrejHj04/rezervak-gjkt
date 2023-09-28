"use client";
import VerifyUser from "@/sub-components/VerifyUser";
import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession();

  const homepage = (
    <Typography>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium
      assumenda, consectetur aliquid omnis, est, labore similique sapiente
      numquam unde voluptatum consequatur quae eum ea. Praesentium quia hic
      asperiores exercitationem repudiandae.
    </Typography>
  );

  if (data?.user.verified) return homepage;

  return (
    <>
      <div className="absolute z-50">
        <VerifyUser />
      </div>
      <Box sx={{ filter: "blur(5px)" }}>{homepage}</Box>
    </>
  );
}
