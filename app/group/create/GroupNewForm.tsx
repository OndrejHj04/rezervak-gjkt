"use client";
import {
  Autocomplete,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createNewGroup } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function GroupNewForm({
  options,
  user,
}: {
  options: any
  user: any;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
    reset
  } = useForm({
    defaultValues: {
      name: "", description: "", owner: options.find((item: any) => item.id === user.id)
    }
  });

  const { push, refresh } = useRouter()

  const onSubmit = async (data: any) => {
    reset(data)
    createNewGroup({
      ...data,
      owner: data.owner.id,
    }).then(({ success }) => {
      if (success) toast.success(`Skupina  úspěšně vytvořena`);
      else toast.error("Něco se pokazilo");
      push("/group/list")
      refresh()
    });
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between gap-2 mb-2">
        <Typography variant="h5">Nová skupina</Typography>
        <Button
          type="submit"
          variant="outlined"
          size="small"
          disabled={!isValid}
        >
          Uložit
        </Button>
      </div>
      <Paper className="p-2">
        <div className="flex-col flex gap-3 max-w-[320px]">
          <TextField
            label="Název skupiny"
            {...register("name", { required: true })}
          />
          <TextField
            label="Popis"
            className="col-span-2"
            {...register("description", { required: true })}
          />
          <Controller
            control={control}
            {...register("owner", { required: true })}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                fullWidth
                value={value}
                onChange={(_, value) => {
                  onChange(value);
                }}
                options={options}
                getOptionLabel={(option: any) => option.name}
                renderOption={(props: any, option: any) => <li {...props}><span className="flex justify-between w-full">
                  <Typography>{option.name}</Typography>
                  <Typography color="text.secondary">{option.email}</Typography>
                </span></li>}
                renderInput={(params) => (
                  <TextField {...params} label="Majitel skupiny" />
                )}
              />
            )}
          />
        </div>
      </Paper>
    </form>
  );
}
