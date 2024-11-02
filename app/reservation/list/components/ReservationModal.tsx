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
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { reservationUpdateStatus } from "@/lib/api";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export const statuses = [
  { id: 2, color: "#FCD34D", displayName: "Čeká na potvrzení", icon: "running_with_errors" },
  { id: 3, color: "#34D399", displayName: "Potvrzeno", icon: "done_all" },
  { id: 4, color: "#ED9191", displayName: "Zamítnuto", icon: "gpp_bad" },
]

export default function ReservationModal({
  reservation,
}: {
  reservation: any;
}) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const nextSearchParams = new URLSearchParams(searchParams)
  const { back, replace } = useRouter();
  const {
    handleSubmit,
    control,
    register,
    watch,
    resetField,
    formState: { isValid, dirtyFields },
  } = useForm({
    defaultValues: { status: statuses.find((item: any) => item.id === reservation.status_id), reason: reservation.reject_reason || "", successLink: reservation.success_link || "", paymentSymbol: reservation.payment_symbol || "" },
  });
  const selectedStatus = watch("status")

  const isActive = Number(searchParams.get("reservation_id")) === reservation.id;

  const onSubmit = (data: any) => {
    setLoading(true);
    reservationUpdateStatus({
      id: reservation.id,
      newStatus: data.status.id,
      oldStatus: reservation.status_id,
      ...(data.reason.length && { rejectReason: data.reason }),
      ...(data.paymentSymbol.length && { paymentSymbol: data.paymentSymbol }),
      ...(data.successLink.length && { successLink: data.successLink }),
    }).then(({ success }) => {
      success && toast.success("Status rezervace úspěšně změněn");
      !success && toast.error("Něco se nepovedlo");
      nextSearchParams.delete("reservation_id")
      replace(`/reservation/list?${nextSearchParams}`)
    });
  };

  useEffect(() => {
    resetField("successLink")
    resetField("reason")
    resetField("paymentSymbol")
  }, [selectedStatus])

  return (
    <Modal open={isActive} onClose={() => back()}>
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
            Vedoucí rezervace: {reservation.leader_name}
          </Typography>
          <Controller
            control={control}
            {...register("status", { required: true })}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                value={value}
                onChange={(_, value) => onChange(value)}
                options={statuses}
                getOptionLabel={(option: any) => option.displayName}
                renderOption={(props: any, option: any) => (
                  <ListItem disablePadding {...props}>
                    <ListItemIcon>
                      <Icon sx={{ color: option.color }}>{option.icon}</Icon>
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography>{option.displayName}</Typography>}
                    />
                  </ListItem>
                )}
                renderInput={(params) => (
                  <TextField className="my-2" {...params} label="Nový status" />
                )}
              />
            )}
          />
          {watch("status")?.id === 4 && <TextField fullWidth className="mb-2" {...register("reason")} label="Důvod zamítnutí" />}
          {watch("status")?.id === 3 && <React.Fragment>
            <TextField fullWidth className="mb-2" {...register("successLink")} label="Odkaz na web Pece pod Sněžkou" />
            <TextField fullWidth className="mb-2" {...register("paymentSymbol")} label="Variabilní symbol" />
          </React.Fragment>}
          <Button
            className="w-full"
            variant="contained"
            disabled={!dirtyFields?.status || !isValid || loading}
            type="submit"
          >
            Uložit
          </Button>
        </Paper>
      </form>
    </Modal>
  );
}
