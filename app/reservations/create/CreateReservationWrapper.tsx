"use client";
import { Group } from "@/types";
import ReservationCalendarPicker from "./ReservationCalendarPicket";
import ReservationMembersForm from "./ReservationMembersForm";
import ReservationRoomsSlider from "./ReservationRoomsSlider";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { Button, Typography } from "@mui/material";

export default function CreateReservationWrapper({
  groups,
  users,
}: {
  groups: Group[];
  users: User[];
}) {
  const { handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex mb-2 justify-between items-center w-full">
        <Typography variant="h4">Nová rezervace</Typography>
        <Button variant="contained">Uložit</Button>
      </div>
      <form className="flex gap-2" onSubmit={handleSubmit(onSubmit)}>
        <ReservationMembersForm groups={groups} users={users} />
        <ReservationRoomsSlider />
        <ReservationCalendarPicker />
      </form>
    </div>
  );
}
