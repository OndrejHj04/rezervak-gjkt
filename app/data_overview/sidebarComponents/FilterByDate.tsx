"use client";
import { Button, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export default function FilterByDate() {
  const searchParams = useSearchParams();
  const from_date = searchParams.get("from_date");
  const to_date = searchParams.get("to_date");

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      from_date: dayjs(from_date).isValid() ? dayjs(from_date) : null,
      to_date: dayjs(to_date).isValid() ? dayjs(to_date) : null,
    },
  });

  const { replace } = useRouter();
  const pathname = usePathname();

  const onSubmit = (data: any) => {
    const { from_date, to_date } = data;

    const params = new URLSearchParams(searchParams);
    dayjs(from_date).isValid() && params.set("from_date", from_date.toString());
    dayjs(to_date).isValid() && params.set("to_date", to_date.toString());
    replace(`${pathname}?${params.toString()}`);

    reset(data);
  };

  useEffect(() => {
    !from_date && setValue("from_date", null);
    !to_date && setValue("to_date", null);
  }, [from_date, to_date]);

  return (
    <form className="flex gap-2 flex-col" onSubmit={handleSubmit(onSubmit)}>
      <Typography className="text-xl text-center">
        Filtrování podle datumu
      </Typography>
      <Controller
        name="from_date"
        control={control}
        render={({ field }) => (
          <DatePicker {...field} label="Začátek" format="DD. MM. YYYY" />
        )}
      />
      <Controller
        name="to_date"
        control={control}
        render={({ field }) => (
          <DatePicker {...field} label="Konec" format="DD. MM. YYYY" />
        )}
      />
      <Button variant="outlined" type="submit" size="small" disabled={!isDirty}>
        Filtrovat
      </Button>
    </form>
  );
}
