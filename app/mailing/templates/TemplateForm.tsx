"use client";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { mailingTemplateEdit } from "@/lib/api";
import { useRouter } from 'next/navigation';
import CustomEditor from "../CustomEditor";

export default function TemplateForm({ template }: { template: any }) {
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
      <div className="flex justify-between mb-2">
        <Typography variant="h5">Úprava emailové šablony</Typography>
        <Button
          type="submit"
          size="small"
          variant="outlined"
          disabled={!isValid || !isDirty}
        >
          Uložit
        </Button>
      </div>
      <Paper className="flex flex-col gap-3 p-2">
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
      </Paper>
    </form>
  );
}
