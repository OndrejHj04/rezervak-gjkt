"use client";

import {
  Autocomplete,
  Button,
  Divider,
  Icon,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReservationListMakeRefetch from "../refetch";
import { getReservationsStatus, reservationUpdateStatus } from "@/lib/api";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function ReservationModal({
  reservation,
}: {
  reservation: any;
}) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { isDirty, isValid },
  } = useForm({
    defaultValues: { status: reservation.status },
  });

  const isActive = Number(params.get("reservation_id")) === reservation.id;
  useEffect(() => {
    setLoading(false);
    if (isActive) {
      getReservationsStatus({ filter: true }).then((data) => setStatuses(data));
    }
  }, [isActive]);

  const onSubmit = (data: any) => {
    setLoading(true);
    reservationUpdateStatus({
      id: reservation.id,
      newStatus: data.status.id,
      oldStatus: reservation.status.id,
    }).then(({ success }) => {
      success && toast.success("Status rezervace úspěšně změněn");
      !success && toast.error("Něco se nepovedlo");
      reset(data);
    });
    ReservationListMakeRefetch();
  };

  return (
    <Modal open={isActive} onClose={() => replace(pathname)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper style={style} className="p-2 ">
          <Typography variant="h5">Změnit status rezervace</Typography>
          <Divider className="mb-2" />
          <Typography variant="h6">
            Od: {dayjs(reservation.from_date).format("DD. MM. YYYY")}
          </Typography>
          <Typography variant="h6">
            Do: {dayjs(reservation.to_date).format("DD. MM. YYYY")}
          </Typography>
          <Typography variant="h6">
            Vedoucí rezervace: {reservation.leader.first_name}{" "}
            {reservation.leader.last_name}
          </Typography>
          <Controller
            control={control}
            {...register("status", { required: true })}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                value={value}
                onChange={(_, value) => onChange(value)}
                options={statuses}
                getOptionLabel={(option: any) => option.display_name}
                renderOption={(props: any, option: any) => (
                  <ListItem disablePadding {...props}>
                    <ListItemIcon>
                      <Icon sx={{ color: option.color }}>{option.icon}</Icon>
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography>{option.display_name}</Typography>}
                    />
                  </ListItem>
                )}
                renderInput={(params) => (
                  <TextField className="my-2" {...params} label="Nový status" />
                )}
              />
            )}
          />
          <Button
            className="w-full"
            variant="contained"
            disabled={!isDirty || !isValid || loading}
            type="submit"
          >
            Uložit
          </Button>
        </Paper>
      </form>
    </Modal>
  );
}
