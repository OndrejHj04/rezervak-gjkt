"use client";

import {
  Button,
  Divider,
  MenuItem,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { reservationUpdateStatus } from "@/lib/api";
import { dayjsExtended } from "@/lib/dayjsExtended";

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

export default function ReservationModal({ reservation }: { reservation: any }) {
  const searchParams = useSearchParams();
  const nextSearchParams = new URLSearchParams(searchParams)

  const { register, handleSubmit, watch, control, formState: { dirtyFields } } = useForm({
    defaultValues: {
      status: reservation.status_id,
      reject_reason: reservation.reject_reason,
      success_link: reservation.success_link
    }
  })

  const { back, replace } = useRouter()
  const watchStatus = watch("status")
  const dirtyStatus = Boolean(dirtyFields.status)

  const onSubmit = (data: any) => {
    reservationUpdateStatus({ id: reservation.id, newStatus: data.status, rejectReason: data.reject_reason, successLink: data.success_link }).then(({ success }) => {
      if (success) toast.success("Status rezervace úspěšně upraven!")
      else toast.error("Něco se nepovedlo")
    })
    nextSearchParams.delete("reservation_id")
    replace(`/reservation/list?${nextSearchParams}`)
  }

  return (
    <Modal open={true} onClose={() => back()}>
      <Paper className="p-2 min-w-[300px]" style={style}>
        <Typography variant="h5">Název: {reservation.name}</Typography>
        <Divider />
        <Typography variant="h6">Začátek: {dayjsExtended(reservation.from_date).format("DD. MMMM")}</Typography>
        <Typography variant="h6">Konec: {dayjsExtended(reservation.to_date).format("DD. MMMM")}</Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Controller control={control} name="status" render={({ field }) => (
            <TextField {...field} label="Status" select className="mt-2" fullWidth>
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>{status.displayName}</MenuItem>
              ))}
            </TextField>
          )} />
          {watchStatus === 4 && <TextField {...register("reject_reason")} label="Důvod zamítnutí" />}
          {watchStatus === 3 && <TextField {...register("success_link")} label="Odkaz na web Pece pod Sněžkou" />}
          <Button type="submit" fullWidth disabled={!dirtyStatus} variant="contained">Uložit</Button>
        </form>
      </Paper>
    </Modal>
  );
}
