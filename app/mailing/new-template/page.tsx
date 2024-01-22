"use client";
import fetcher from "@/lib/fetcher";
import LoadingButton from "@mui/lab/LoadingButton";
import { Tab, Tabs, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MailingRefetch from "../mailingRefetch";

export default function NewTemplate() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    fetcher("/api/mailing/templates/create", {
      body: JSON.stringify({ ...data }),
      method: "POST",
    }).then((data) => {
      toast.success(`Emailová šablona vytvořena`);
      MailingRefetch("templates");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex justify-between gap-2">
        <Typography variant="h5">Nová emailová šablona</Typography>
        <LoadingButton type="submit" variant="contained" disabled={!isValid}>
          Uložit
        </LoadingButton>
      </div>
      <div className="flex flex-col gap-2">
        <TextField
          {...register("title", { required: true, minLength: 10 })}
          className="w-full"
          label="Předmět"
        />
        <TextField
          multiline
          label="Obsah emailu"
          rows={10}
          {...register("text", { required: true })}
        />
      </div>
    </form>
  );
}
