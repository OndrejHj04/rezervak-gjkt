import React from "react";
import { Tab, Tabs } from "@mui/material";
import Link from "next/link";
import GroupDetailForm from "./GroupDetailForm";
import GroupDetailDisplay from "./GroupDetailDisplay";
import { getGroupDetail, } from "@/lib/api";
import GroupDeleteButton from "./GroupDeleteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function GroupListConfig({
  searchParams,
  params,
}: {
  searchParams: any;
  params: any;
}) {
  const { user } = await getServerSession(authOptions) as any

  const { mode, reservations, users } = searchParams
  const { id } = params

  const { data: group } = (await getGroupDetail({
    id,
    rpage: reservations || 1,
    upage: users || 1,
  })) as any;

  const allowModification = user.role.id !== 3 || user.id === group.owner.id

  return (
    <React.Fragment>
      <div className="flex justify-between items-center">
        <Tabs aria-label="basic tabs example" value={mode === "edit" ? 1 : 0}>
          <Tab
            component={Link}
            href={{
              pathname: `/group/detail/${id}`,
              query: { mode: 'view' }
            } as any}
            label="Zobrazit"
          />
          <Tab
            component={Link}
            href={{
              pathname: `/group/detail/${id}`,
              query: { mode: "edit" }
            }}
            disabled={!allowModification}
            label="Editovat"
          />
        </Tabs>
        <GroupDeleteButton groupId={group.id} disabled={!allowModification} />
      </div>
      {mode === "edit" ? (
        <GroupDetailForm group={group} />
      ) : (
        <GroupDetailDisplay group={group} />
      )}
    </React.Fragment>
  );
}
