"use client";
import { Group } from "@/types";
import ReservationCalendarPicker from "./ReservationCalendarPicket";
import ReservationMembersForm from "./ReservationMembersForm";
import ReservationRoomsSlider from "./ReservationRoomsSlider";
import { User } from "next-auth";

export default function CreateReservationWrapper({
  groups,
  users,
}: {
  groups: Group[];
  users: User[];
}) {
  return (
    <form className="flex gap-2">
      <ReservationMembersForm groups={groups} users={users} />
      <ReservationRoomsSlider />
      <ReservationCalendarPicker />
    </form>
  );
}
