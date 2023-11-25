import { Suspense } from "react";
import GroupDetailDisplay from "./GroupDetailDisplay";
import GroupDetailForm from "./GroupDetailForm";
import GroupDetailNavigation from "./GroupDetailNavigation";
import { Skeleton } from "@mui/material";

export default async function Page({
  params: { id },
  searchParams: { mode },
}: {
  params: { id: string };
  searchParams: { mode: string };
}) {
  return (
    <>
      <GroupDetailNavigation id={id} mode={mode} />
      {mode === "view" ? (
        <GroupDetailDisplay id={id} />
      ) : (
        <GroupDetailForm id={id} />
      )}
    </>
  );
}
