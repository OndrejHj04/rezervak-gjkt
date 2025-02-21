"use client";
import { createUserAccount } from "@/lib/api";
import { Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const roles = [
  { id: 1, label: "Admin" },
  { id: 2, label: "Správce" },
  { id: 3, label: "Uživatel" }
]

export default function CreateUserForm({ role }: { role: any }) {
  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    reset
  } = useForm();
  const { refresh, push } = useRouter()

  const onSubmit = async (data: any) => {
    reset(data)
    createUserAccount({
      ...data,
    }).then(({ success, msg }) => {
      if (success) {
        toast.success("Uživatel úspěšně vytvořen");
        push("/user/list")
        refresh()
      }
      else toast.error(msg || "Něco se nepovedlo");
    });
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex justify-between gap-2">
        <Typography variant="h5">Vytvořit uživatele</Typography>
        <Button
          type="submit"
          variant="outlined"
          size="small"
          disabled={!isValid || !isDirty}
        >
          Uložit
        </Button>
      </div>
      <Paper className="p-2">
        <div className="flex flex-col max-w-[320px] gap-3">
          <TextField
            label="Jméno"
            {...register("first_name", { required: true })}
          />
          <TextField
            label="Příjmení"
            {...register("last_name", { required: true })}
          />
          <TextField
            label="Email"
            {...register("email", {
              required: true,
              pattern: {
                value: /@/,
                message: "Neplatný email",
              },
            })}
          />
          <TextField {...register("role", { required: true })} select label="Role">
            {roles.map((urole) => (
              <MenuItem key={urole.id} disabled={urole.id < role} value={urole.id}>{urole.label}</MenuItem>
            ))}
          </TextField>
        </div>
      </Paper>
    </form>
  );
}
