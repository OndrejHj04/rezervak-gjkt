import { Tab, Tabs } from "@mui/material";
import Link from "next/link";

export default function UserDetailNavigation({
  id,
  mode,
}: {
  id: any;
  mode: any;
}) {
  return (
    <div className="flex justify-between">
      <div>
        <Tabs aria-label="basic tabs example" value={mode === "edit" ? 1 : 0}>
          <Tab
            component={Link}
            href={`/user/detail/${id}?mode=view`}
            label="Zobrazit"
          />
          <Tab
            component={Link}
            href={`/user/detail/${id}?mode=edit`}
            label="Editovat"
          />
        </Tabs>
      </div>
    </div>
  );
}
