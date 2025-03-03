"use client";
import { updateSettings } from "@/lib/api";
import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function SettingsForm({ data }: any) {
  const { main_application_email, registration_document_spreadsheet } = data;
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm({
    defaultValues: {
      main_application_email,
      registration_document_spreadsheet,
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
