"use client";
import React from "react";
import DataOverviewTableRow from "./DataOverviewTableRow";
import { store } from "@/store/store";

export default function DataOverviewTable({ data }: any) {
  const { fusionData } = store();

  return (
    <React.Fragment>
      {data.map((user: any) => (
        <DataOverviewTableRow key={user.id} user={user} />
      ))}
    </React.Fragment>
  );
}
