"use client";
import { store } from "@/store/store";
import SleepingUserInfo from "@/sub-components/SleepingUserInfo";
import VerifyUser from "@/sub-components/VerifyUser";
import WelcomeComponent from "@/sub-components/WelcomeComponent";
import {
  Box,
  MenuItem,
  MenuList,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { useEffect, useState } from "react";
import { Group } from "@/types";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, userLoading } = store();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { push } = useRouter();

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:3000/api/users/detail/${user?.id}/groups`)
        .then((res) => res.json())
        .then(({ data }) => {
          setGroups(data);
          setLoading(false);
        })
        .catch((e) => {});
    }
  }, [user]);

  const homepage = (
    <>
      <Paper className="p-2">
        <div className="flex justify-between items-center gap-3">
          <GroupIcon color="primary" />
          <Typography variant="h5">Moje skupiny</Typography>
          <GroupIcon color="primary" />
        </div>
        <MenuList>
          {groups.length ? (
            groups.map((group) => (
              <MenuItem
                onClick={() => push(`/group/detail/${group.id}`)}
                key={group.id}
              >
                {group.name}
              </MenuItem>
            ))
          ) : (
            <Typography>Žádné skupiny</Typography>
          )}
        </MenuList>
      </Paper>
    </>
  );

  if (userLoading)
    return (
      <>
        <Skeleton variant="rectangular" width={300} height={170} />
        <Skeleton variant="rectangular" width={200} height={250} />
        <Skeleton variant="rectangular" width={300} height={170} />
        <Skeleton variant="circular" width={30} height={30} />
      </>
    );

  if (!user && !userLoading) {
    return <WelcomeComponent />;
  }

  if (!user?.active && user?.role.role_id !== 1) {
    return (
      <>
        <div className="absolute z-50">
          <SleepingUserInfo />
        </div>
        <Box sx={{ filter: "blur(5px)" }}>{homepage}</Box>
      </>
    );
  }

  if (!user?.verified) {
    return (
      <>
        <div className="absolute z-50">
          <VerifyUser id={user?.id} />
        </div>
        <Box sx={{ filter: "blur(5px)" }}>{homepage}</Box>
      </>
    );
  }

  return homepage;
}
