import {
  Autocomplete,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { getGroupList, reservationsAddGroups } from "@/lib/api";
import { useRouter } from "next/navigation";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function AddGroupsModal({
  currentGroups,
  reservationId,
  setModal,
}: {
  currentGroups: number[];
  reservationId: number;
  setModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [groups, setGroups] = useState(null);
  const { refresh } = useRouter()
  const {
    handleSubmit,
    control,
    register,
    formState: { isValid },
  } = useForm();
  useEffect(() => {
    getGroupList({ limit: true }).then((res) => setGroups(res.data));
  }, []);

  const onSubmit = (data: any) => {
    reservationsAddGroups({
      reservation: reservationId,
      groups: data.groups.map((group: any) => group.id),
    }).then(({ success }) => {
      success && toast.success("Skupiny úspěšně přidány do rezervace");
      !success && toast.error("Něco se nepovedlo");
    });
    refresh()
    setModal(false);
  };
  return (
    <Paper sx={style} className="p-2">
      <Typography variant="h5" className="mb-2 text-center">
        Přidat skupiny
      </Typography>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        {groups ? (
          <Controller
            control={control}
            {...register("groups", { required: true })}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                value={value}
                onChange={(e, value) => {
                  onChange(value);
                }}
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
            )}
          />
        ) : (
          <CircularProgress />
        )}
        <Button variant="contained" type="submit" disabled={!isValid}>
          Uložit
        </Button>
      </form>
    </Paper>
  );
}
