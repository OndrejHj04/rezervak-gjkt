"use client";
import { Box, Button, Divider, Modal, Paper, Typography } from "@mui/material";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import { Dispatch, SetStateAction } from "react";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { toast } from "react-toastify";
import MakeUserListRefetch from "../../list/refetch";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function UserSleepModal({
  setModal,
  data,
}: {
  setModal: Dispatch<SetStateAction<boolean>>;
  data: any;
}) {
  const makeUserSleep = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/edit/${data?.id}`, {
      body: JSON.stringify({ active: false }),
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast.success(
            `Uživatel ${res.data?.first_name} ${res.data?.last_name} byl uspán`
          );
        } else toast.error(`Něco se nepovedlo`);

        setModal(false);
        MakeUserListRefetch();
      });
  };
  return (
    <Paper sx={style} className="p-4 flex flex-col gap-2 max-w-sm">
      <div className="flex items-center justify-between">
        <NoAccountsIcon sx={{ color: "#ED9191", fontSize: 36 }} />
        <Typography variant="h5">Uspat uživatele</Typography>
        <NoAccountsIcon sx={{ color: "#ED9191", fontSize: 36 }} />
      </div>
      <Divider />
      <Box className="flex items-center gap-2">
        <AvatarWrapper data={data!} />
        <Typography variant="h6">
          {data?.first_name} {data?.last_name}
        </Typography>
      </Box>
      <Divider />
      <Typography className="text-justify">
        Uspání uživatele mu znemožňuje jakoukoliv interakci s aplikací. Není
        možné provádět rezervace, ani spravovat svůj účet. Uživateli bude
        administrátor moci kdykoliv znovu přiřadit stav aktivního účtu.
      </Typography>
      <Button color="error" variant="contained" onClick={makeUserSleep}>
        deaktivovat
      </Button>
    </Paper>
  );
}
