"use client";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Button,
  ButtonBase,
  CardHeader,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  groupDetailEdit,
} from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GroupDetailForm({ group }: { group: any }) {
  const { refresh } = useRouter();
  const {
    formState: { isDirty },
    register,
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: group.name,
      description: group.description,
    },
  });

  const onSubmit = (data: any) => {
    groupDetailEdit({
      id: group.id,
      name: data.name,
      description: data.description
    }).then(({ success }) => {
      if (success) toast.success("Skupina úspěšně upravena");
      else toast.error("Něco se nepovedlo");
    });
    reset(data)
    refresh()
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper className="flex gap-3 sm:p-3 p-1 sm:flex-row flex-col">
          <div>
            <Typography variant="h5">Vedoucí skupiny: </Typography>
            <Divider flexItem orientation="horizontal" />
            <ButtonBase className="!mt-2 !p-1">
              <CardHeader component={Link} href={`/user/detail/${group.owner.id}`} className="!p-0 text-inherit no-underline text-left" titleTypographyProps={{ variant: "h5" }} avatar={<AvatarWrapper size={48} data={group.owner as any} />} title={`${group.owner.first_name} ${group.owner.last_name}`} subheader={group.owner.email} />
            </ButtonBase>
          </div>
          <Divider orientation="vertical" flexItem />
          <div className="flex flex-col gap-3 sm:w-[360px]">
            <TextField label="Jméno" {...register("name")} fullWidth />
            <TextField
              {...register("description")}
              multiline
              fullWidth
              minRows={4}
              maxRows={4}
              label="Popis skupiny"
            />
            <Button variant="outlined" type="submit" disabled={!isDirty}>
              Uložit
            </Button>
          </div>
        </Paper>
      </form>
    </>
  );
}
