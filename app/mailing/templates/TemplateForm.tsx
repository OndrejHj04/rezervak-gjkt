"use client";
import LoadingButton from "@mui/lab/LoadingButton";
import { Chip, Paper, TextField, Typography } from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { mailingTemplateEdit } from "@/lib/api";
import { useRouter } from 'next/navigation';
import CustomEditor from "../CustomEditor";

export default function TemplateForm({ template }: { template?: any }) {
  const router = useRouter()
  const methods = useForm({
    defaultValues: template || null,
  });
  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    control,
  } = methods

  const onSubmit = (data: any) => {
    mailingTemplateEdit({
      ...data,
    }).then(({ success }) => {
      success && toast.success(`Emailová šablona upravena`);
      !success && toast.error("Něco se nepovedlo");

      router.push("/mailing/templates")
      router.refresh()
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper className="flex flex-col gap-3 p-2">
        <div className="flex justify-between items-center">
          <Typography variant="h5">
            {template ? "Úprava emailové šablony" : "Nová emailová šablona"}
          </Typography>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={!isValid || !isDirty}
          >
            Uložit
          </LoadingButton>
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
