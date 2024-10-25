"use client"

import { FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TimelineToggle() {
  const searchParams = useSearchParams();
  const value = searchParams.get("timelineDisplay") || "new";
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (_: any, label: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("timelineDisplay", label);
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <RadioGroup row value={value} onChange={handleChange} className="-my-2">
      <FormControlLabel value="new" label="Nejnovější" control={<Radio disableRipple />} />
      <FormControlLabel value="future" label="Budoucí" control={<Radio disableRipple />} />
    </RadioGroup>
  )
}
