"use client";
import { Group } from "@/types";
import ReservationCalendarPicker from "./ReservationCalendarPicket";
import ReservationMembersForm from "./ReservationMembersForm";
import ReservationRoomsSlider from "./ReservationRoomsSlider";
import { User } from "next-auth";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Typography } from "@mui/material";
import { watch } from "fs";
import dayjs from "dayjs";

export default function CreateReservationWrapper({
  groups,
  users,
}: {
  groups: Group[];
  users: User[];
}) {
  const methods = useForm({
    defaultValues: {
      users: [],
      groups: [],
      rooms: 1,
      fromDate: null,
      toDate: null,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex mb-2 justify-between items-center w-full">
          <Typography variant="h4">Nová rezervace</Typography>
          <Button variant="contained" type="submit">
            Uložit
          </Button>
        </div>
        <div className="flex gap-2">
          <ReservationMembersForm groups={groups} users={users} />
          <ReservationRoomsSlider />
          <ReservationCalendarPicker />
        </div>
      </form>
    </FormProvider>
  );
}
