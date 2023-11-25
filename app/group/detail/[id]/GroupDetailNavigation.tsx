import { Button, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

export default function GroupDetailNavigation({
  id,
  mode,
}: {
  id: string;
  mode: string;
}) {
  return (
    <div className="flex justify-between">
      <div>
        <Tabs aria-label="basic tabs example" value={mode === "view" ? 0 : 1}>
          <Tab
            component={Link}
            href={`/group/detail/${id}?mode=view`}
            label="Zobrazit"
          />
          <Tab
            component={Link}
            href={`/group/detail/${id}?mode=edit`}
            label="Editovat"
          />
        </Tabs>
      </div>
    </div>
  );
}