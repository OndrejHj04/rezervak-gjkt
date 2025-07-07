"use client";
import React, { useMemo, useContext } from "react";
import DataOverviewTableRow from "./DataOverviewTableRow";
import { FusionContext } from "./layout";

export default function DataOverviewTable({ data }: any) {
  const { fusionData } = useContext(FusionContext);

  const fusedData = useMemo(() => {
    if (!fusionData?.length) return data;

    let remainingData = [...data];

    fusionData.forEach((fusionGroup: any) => {
      const name = Object.keys(fusionGroup)[0];
      const idsToFuse = new Set(Object.values(fusionGroup)[0] as any);
      const objectsToFuse = remainingData.filter((item) =>
        idsToFuse.has(item.id)
      );
      remainingData = remainingData.filter((item) => !idsToFuse.has(item.id));

      if (objectsToFuse.length === 0) return;

      const fusedObject = { ...objectsToFuse[0] };

      fusedObject.name = name;
      fusedObject.total_nights = objectsToFuse.reduce(
        (sum, item) => sum + Number(item.total_nights),
        0
      );
      fusedObject.user_detail = objectsToFuse.flatMap(
        (item) => item.user_detail
      );
      fusedObject.reservation_detail = objectsToFuse.flatMap(
        (item) => item.reservation_detail
      );

      delete fusedObject.image;

      remainingData.unshift(fusedObject);
    });

    return remainingData;
  }, [data, fusionData]);

  return (
    <>
      {fusedData.map((user: any) => (
        <DataOverviewTableRow key={user.id} user={user} />
      ))}
    </>
  );
}
