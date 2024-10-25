import React from "react";
import { Tab, Tabs } from "@mui/material";
import Link from "next/link";
import GroupDetailForm from "./GroupDetailForm";
import GroupDetailDisplay from "./GroupDetailDisplay";
import { getGroupDetail, } from "@/lib/api";
import GroupDeleteButton from "./GroupDeleteButton";

export default async function GroupListConfig({
  searchParams,
  params,
}: {
  searchParams: any;
  params: any;
}) {
  const { mode, reservations, users } = searchParams
  const { id } = params

  const { data: group } = (await getGroupDetail({
    id,
    rpage: reservations || 1,
    upage: users || 1,
  })) as any;


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
            label="Editovat"
          />
        </Tabs>
        <GroupDeleteButton groupId={group.id} />
      </div>
      {mode === "edit" ? (
        <GroupDetailForm group={group} />
      ) : (
        <GroupDetailDisplay group={group} />
      )}
    </React.Fragment>
  );
}
