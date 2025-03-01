"use client";
import React from "react";
import DataOverviewTableRow from "./DataOverviewTableRow";
import { store } from "@/store/store";

export default function DataOverviewTable({ data }: any) {
  const { fusionData } = store();
  const fusedIds = fusionData
    .flatMap((item: any) => item)
    .map((item: any) => item.id);

  const fusedData = [
    ...data.filter((item: any) => !fusedIds.includes(item.id)),
    ...fusionData.map((item: any) => {
      const [first, second] = item;

      return {
        id: Date.now().toString(),
        name: `${first.name} + ${second.name}`,
        total_nights: Number(first.total_nights) + Number(second.total_nights),
        user_detail: [...first.user_detail, ...second.user_detail],
        reservation_detail: [
          ...first.reservation_detail,
          ...second.reservation_detail,
        ],
      };
    }),
  ];

  console.log(fusedData);
  return (
    <React.Fragment>
      {fusedData.map((user: any) => (
        <DataOverviewTableRow key={user.id} user={user} />
      ))}
    </React.Fragment>
  );
}
