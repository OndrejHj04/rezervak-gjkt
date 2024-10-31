"use client";
import { Button, Chip, Paper, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { mailingTemplateEdit } from "@/lib/api";
import { useRouter } from 'next/navigation';
import CustomEditor from "../CustomEditor";

export default function TemplateForm({ template }: { template?: any }) {
  const { push, refresh } = useRouter()
  const methods = useForm({
    defaultValues: template || null,
  });
  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    control,
    reset
  } = methods

  const onSubmit = (data: any) => {
    reset()
    mailingTemplateEdit({
      ...data,
    }).then(({ success }) => {
      if (success) toast.success(`Emailová šablona upravena`);
      else toast.error("Něco se nepovedlo");

      push("/mailing/templates")
      refresh()
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper className="flex flex-col gap-3 p-2">
        <div className="flex justify-between items-center">
          <Typography variant="h5">
            {template ? "Úprava emailové šablony" : "Nová emailová šablona"}
          </Typography>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || !isDirty}
          >
            Uložit
          </Button>
        </div>
        <TextField
          {...register("name", { required: true })}
          className="w-full"
          label="Název"
        />
        <TextField
          {...register("title", { required: true })}
          className="w-full"
          label="Předmět"
        />
        <Controller control={control} {...register("text")} render={({ field }) => (
          <CustomEditor onEditorChange={field.onChange} value={field.value} variables={template.variables} initialValue={template.text}
          />)} />
        {template && (
          <div className="flex items-center gap-2">
            <Typography>
              V této šabloně je možné použít následující proměnné
            </Typography>
            {template.variables.map((item: any, i: any) => (
              <Chip key={i} label={`\${${item}}`} />
            ))}
          </div>
        )}
      </Paper>
    </form>
  );
}
