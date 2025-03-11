"use client";
import { updateSettings } from "@/lib/api";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function SettingsForm({ data }: any) {
  const {
    main_application_email,
    registration_document_spreadsheet,
    ZO_payment,
    employees_payment,
    public_payment,
    whole_object,
    bank_account_number,
    payment_symbol_format,
  } = data;

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    setValue,
    formState: { isDirty, isValid },
  } = useForm({
    defaultValues: {
      main_application_email,
      registration_document_spreadsheet,
      ZO_payment,
      employees_payment,
      public_payment,
      whole_object,
      bank_account_number,
      payment_symbol_format,
    },
  });

  const onSubmit = (data: any) => {
    updateSettings(data).then(({ success, msg }) => {
      if (success) toast.success(`Nastavení úspěšně uloženo`);
      else toast.error(msg || "Něco se pokazilo");
    });
    reset(data);
  };

  const addCustomKey = (key: string) => {
    const currentValue = getValues("payment_symbol_format") || "";
    setValue("payment_symbol_format", `${currentValue}${key}`, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 w-1/2">
          <Typography variant="h6">Globální nastavení</Typography>
          <TextField
            {...register("main_application_email", { required: true })}
            label="Hlavní email"
            helperText="Emailová adresa ze které jsou odesílána upozornění"
          />
          <TextField
            {...register("registration_document_spreadsheet", {
              required: true,
            })}
            label="Spreadsheet registrací"
            helperText="Soubor v tabulkách google s informacemi o registracích"
          />
          <TextField
            {...register("bank_account_number", { required: true })}
            label="Číslo účtu"
            helperText="Číslo účtu zkontrolujte, vložená hodnota neprochází validací"
          />
          <Controller
            name="payment_symbol_format"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Formát variabilního symbolu"
                helperText="Musí mít maximálně 10 znaků. Kliknutím na tlačítka přidáte znak formátu podle určité proměnné. Ty budou ve formátu označeny příslušným písmenem a symbolem $. Do formátu lze přidávat také absolutní znaky - ty nebou mít prefix v podobě dolaru."
              />
            )}
          />
          <div>
            <Button size="small" onClick={() => addCustomKey("$Z")}>
              Začátek rezervace ($Z)
            </Button>
            <Button size="small" onClick={() => addCustomKey("$K")}>
              Konec rezervace ($K)
            </Button>
            <Button size="small" onClick={() => addCustomKey("$J")}>
              Jméno vedoucího ($J)
            </Button>
            <Button size="small" onClick={() => addCustomKey("$N")}>
              Náhodný symbol ($N)
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <Typography variant="h6">Ceník rezervací</Typography>
          <TextField
            label="ZO"
            type="number"
            {...register("ZO_payment", { required: true })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">Kč</InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Zaměstnanci"
            type="number"
            {...register("employees_payment", { required: true })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">Kč</InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Veřejnost"
            type="number"
            {...register("public_payment", { required: true })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">Kč</InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Celá chata"
            type="number"
            {...register("whole_object", { required: true })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">Kč</InputAdornment>
                ),
              },
            }}
          />
        </div>
      </div>
      <Button variant="contained" disabled={!isDirty || !isValid} type="submit">
        Uložit
      </Button>
    </form>
  );
}
