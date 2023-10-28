import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import AvatarWrapper from "@/ui-components/AvatarWrapper";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function AddGroupsModal({
  modal,
  setModal,
  currentGroups,
}: {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
  currentGroups: number[];
}) {
  const [groups, setGroups] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/list`)
      .then((res) => res.json())
      .then((res) => setGroups(res.data));
  }, []);

  return (
    <Modal open={modal} onClose={() => setModal(false)}>
      <Paper sx={style} className="p-2 flex flex-col">
        <Typography variant="h5" className="mb-2 text-center">
          Přidat skupiny
        </Typography>
        {groups ? (
          <Autocomplete
            sx={{ width: 300 }}
            multiple
            filterSelectedOptions
            getOptionDisabled={(option: any) =>
              currentGroups.includes(option.id)
            }
            options={groups}
            getOptionLabel={(option: any) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Vybrat skupiny..." />
            )}
          />
        ) : (
          <CircularProgress />
        )}
        <Button variant="contained" className="mt-2">
          Uložit
        </Button>
      </Paper>
    </Modal>
  );
}
