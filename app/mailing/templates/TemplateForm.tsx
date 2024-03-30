"use client";
import fetcher from "@/lib/fetcher";
import LoadingButton from "@mui/lab/LoadingButton";
import { Chip, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MailingRefetch from "../mailingRefetch";
import { mailingTemplateEdit } from "@/lib/api";

export default function TemplateForm({ template }: { template?: any }) {
  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    reset,
  } = useForm({
    defaultValues: template || null,
  });

  const onSubmit = (data: any) => {
    console.log(data);
    mailingTemplateEdit({
      ...data,
    }).then(({ success }) => {
      success && toast.success(`Emailová šablona upravena`);
      !success && toast.error("Něco se nepovedlo");
    });
    MailingRefetch("templates");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex justify-between gap-2">
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
      <div className="flex flex-col gap-2">
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
        <TextField
          multiline
          label="Obsah emailu"
          rows={10}
          {...register("text", { required: true })}
        />
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
      </div>
    </form>
  );
}
