"use client"

import { editReservationDate, editReservationDetail, editReservationRooms, editReservationStatus } from "@/lib/api"
import { rooms } from "@/lib/rooms"
import AvatarWrapper from "@/ui-components/AvatarWrapper"
import { Button, CardHeader, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import React, { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"

export default function ReservationDetailForm({ reservationDetail }: { reservationDetail: any }) {
  const { handleSubmit, watch, register, control, formState: { isValid, isDirty, dirtyFields }, reset } = useForm({
    defaultValues: {
      name: reservationDetail.name || "",
      purpouse: reservationDetail.purpouse || "",
      instructions: reservationDetail.instructions || "",
      from_date: dayjs(reservationDetail.from_date) || "",
      to_date: dayjs(reservationDetail.to_date) || "",
      status: reservationDetail.status_id || "",
      paymentSymbol: reservationDetail.payment_symbol || "",
      rejectReason: reservationDetail.reject_reason || "",
      successLink: reservationDetail.success_link || "",
      rooms: reservationDetail.rooms.map((room: any) => room.id)
    }
  })

  const watchRooms = watch("rooms")
  const bedsCount = useMemo(() => {
    return watchRooms.reduce((a: any, b: any) => {
      return rooms[b - 1].people + a
    }, 0)
  }, [watchRooms])

  const onSubmit = (data: any) => {
    if (dirtyFields.from_date || dirtyFields.to_date) {
      editReservationDate({ reservationId: reservationDetail.id, from_date: data.from_date, to_date: data.to_date }).then(({ success }) => {
        if (success) toast.success("Datum rezervace úspěšně upraveno")
        else toast.error("Něco se nepovedlo")
        reset({ ...data, status: (data.status === 4 || data.status === 3) ? 2 : data.status })
      })
    }

    if (dirtyFields.status) {
      editReservationStatus({ reservationId: reservationDetail.id, newStatus: data.status }).then(({ success, symbol, reject, link }) => {
        if (success) toast.success("Status rezervace úspěšně upraven")
        else toast.error("Něco se nepovedlo")
        reset({ ...data, paymentSymbol: symbol || "", rejectReason: reject || "", successLink: link || "", status: data.status })
      })
    }

    if (dirtyFields.rooms) {
      editReservationRooms({ reservationId: reservationDetail.id, rooms: data.rooms }).then(({ success }) => {
        if (success) toast.success("Pokoje pro rezervaci změněny")
        else toast.error("Něco se nepovedlo")
        reset(data)
      })
    }

    if (Object.keys(dirtyFields).filter((item: any) => item !== 'from_date' && item !== "to_date" && item !== "status" && item !== "rooms").length) {
      editReservationDetail({ reservationId: reservationDetail.id, name: data.name, instructions: data.instructions, purpouse: data.purpouse, paymentSymbol: data.paymentSymbol, successLink: data.successLink, rejectReason: data.rejectReason }).then(({ success }) => {
        if (success) toast.success("Detail rezervace úspěšně upraven")
        else toast.error("Něco se nepovedlo")
        reset(data)
      })
    }
  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} className="my-2 grid grid-cols-2 max-w-[420px] gap-3">
        <div className="col-span-2">
          {reservationDetail.leader_name ? <React.Fragment>
            <Typography variant="h5">Vedoucí rezervace</Typography>
            <CardHeader
              className="!p-0"
              avatar={<AvatarWrapper data={{ image: reservationDetail.leader_image }} size={56} />}
              title={
                <Typography variant="h5">
                  {reservationDetail.leader_name}
                </Typography>
              }
              subheader={reservationDetail.leader_email}
            />
          </React.Fragment> : <Typography variant="h5">Vedoucí rezervace: neznámý uživatel</Typography>}
        </div>
        <TextField label="Název" {...register("name")} className="col-span-2" />
        <Controller control={control} name="from_date" render={({ field }) => (
          <DatePicker {...field} label="Začátek" format="DD. MMMM YYYY" />
        )} />
        <Controller control={control} name="to_date" render={({ field }) => (
          <DatePicker {...field} label="Začátek" format="DD. MMMM YYYY" />
        )} />
        <TextField label="Pokyny pro účastníky" {...register("instructions")} className="col-span-2" />
        <TextField label="Důvod rezervace" {...register("purpouse")} />
        <Controller control={control} name="paymentSymbol" render={({ field }) => (
          <TextField {...field} label="Variabilní symbol pro platbu" />
        )} />
        <Controller control={control} name="successLink" render={({ field }) => (
          <TextField {...field} label="Odkaz na web Pece pod Sněžkou" />
        )} />
        <Controller control={control} name="rejectReason" render={({ field }) => (
          <TextField {...field} label="Důvod zamítnutí" />
        )} />
        <Controller control={control} name="status" render={({ field }) => (
          <TextField {...field} select label="Status" className="col-span-2">
            <MenuItem value={2}>Čeká na potvrzení</MenuItem>
            <MenuItem value={3}>Potvrzeno</MenuItem>
            <MenuItem value={4}>Zamítnuto</MenuItem>
          </TextField>
        )} />
        <Controller control={control} name="rooms" render={({ field }) => (
          <FormControl className="col-span-2">
            <InputLabel id="rooms-label">Pokoje</InputLabel>
            <Select {...field}
              labelId="rooms-label"
              multiple
              id="rooms"
              label="Label"
              renderValue={(selected) => {
                return selected.map((room: any) => `Pokoj ${room}`).join(",")
              }}
            >
              {rooms.map((room: any) => (
                <MenuItem key={room.id} value={room.id}>{room.name}, kapacita: {room.people} osoby</MenuItem>
              ))}
            </Select>
            <FormHelperText>Vybráno {bedsCount} lůžek</FormHelperText>
          </FormControl>
        )} />
        <Button variant="outlined" type="submit" disabled={!isValid || !isDirty} className="col-span-2">Uložit</Button>
      </form>
    </React.Fragment>
  )
}
