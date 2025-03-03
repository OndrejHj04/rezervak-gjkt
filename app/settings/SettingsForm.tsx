"use client";
import { updateSettings } from "@/lib/api";
import {
  Button,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function SettingsForm({ data }: any) {
  const {
    main_application_email,
    registration_document_spreadsheet,
    ZO_payment,
    employees_payment,
    public_payment,
    whole_object,
  } = data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm({
    defaultValues: {
      main_application_email,
      registration_document_spreadsheet,
      ZO_payment,
      employees_payment,
      public_payment,
      whole_object,
    },
  });

  const onSubmit = (data: any) => {
    updateSettings(data).then(({ success }) => {
      if (success) toast.success(`Nastavení úspěšně uloženo`);
      else toast.error("Něco se pokazilo");
    });
    reset(data);
  };

  return (
    <form
      className="flex flex-col gap-4 w-1/3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        {...register("main_application_email", { required: true })}
        label="Hlavní email"
        helperText="Emailová adresa ze které jsou odesílána upozornění"
      />
      <TextField
        {...register("registration_document_spreadsheet", { required: true })}
        label="Spreadsheet registrací"
        helperText="Soubor v tabulkách google s informacemi o registracích"
      />

      <div className="flex flex-col gap-2">
        <Typography variant="h6">Ceník osoba/noc</Typography>
        <TextField
          label="ZO"
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
      <Button
        variant="contained"
        size="small"
        disabled={!isDirty || !isValid}
        type="submit"
      >
        Uložit
      </Button>
    </form>
  );
}
