import { Tab, Tabs } from "@mui/material";
import Link from "next/link";
import GoogleFormButton from "./GoogleFormButton";
import ReservationDetailForm from "./ReservationDetailForm";
import ReservationDetailDisplay from "./ReservationDetailDisplay";
import { getReservationDetail, getReservationsStatus } from "@/lib/api";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function ReservationDetail({
  searchParams,
  params,
}: {
  searchParams: any;
  params: any;
}) {
  const { user } = await getServerSession(authOptions) as any
  const { users, groups, mode, timeline, timelineDisplay } = searchParams
  const { id } = params

  const { data } = (await getReservationDetail({
    id,
    upage: users || 1,
    gpage: groups || 1,
  })) as any;

  const allowModification = user.role.id !== 3 || user.id === data.leader.id

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <div>
          <Tabs aria-label="basic tabs example" value={mode === "edit" ? 1 : 0}>
            <Tab
              component={Link}
              href={`/reservation/detail/${id}?mode=view`}
              label="Zobrazit"
            />
            <Tab
              component={Link}
              href={`/reservation/detail/${id}?mode=edit`}
              label="Editovat"
              disabled={!allowModification}
            />
          </Tabs>
        </div>
        <GoogleFormButton reservation={data} disabled={!allowModification} />
      </div>

      {mode === "edit" ?
        <ReservationDetailForm
          reservation={data}
        /> :
        <ReservationDetailDisplay
          reservation={data}
          timeline={timeline}
          timelineDisplay={timelineDisplay}
        />
      }
    </React.Fragment>
  )
}
