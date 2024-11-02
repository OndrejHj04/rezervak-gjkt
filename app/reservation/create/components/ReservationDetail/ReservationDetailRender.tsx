"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Controller, useForm } from "react-hook-form";
import { store } from "@/store/store";

export default function ReservationDetailRender({ user, options }: { user: any, options: any }) {
  const { createReservation, setCreateReservation } = store();
  const [expanded, setExpanded] = useState(false);
  const reservationValidation =
    createReservation.name && createReservation.purpouse && createReservation.leader;
  const {
    handleSubmit,
    formState: { isValid, isDirty },
    control,
    register,
    reset,
  } = useForm({
    defaultValues: { name: "", purpouse: "", instructions: "", leader: options.find((item: any) => item.id === user.id) }
  });

  const isAdmin = user.role.id !== 3
  const onSubmit = (data: any) => {
    setCreateReservation({
      ...createReservation,
      leader: data.leader.id,
      purpouse: data.purpouse,
      instructions: data.instructions,
      name: data.name,
    });
    setExpanded(false);
    reset(data)
  };

  return (
    <Accordion expanded={expanded}>
      <AccordionSummary
        onClick={() => setExpanded((c) => !c)}
        expandIcon={
          reservationValidation && !expanded ? (
            <CheckCircleIcon color="success" />
          ) : (
            <ExpandMoreIcon />
          )
        }
      >
        <Typography variant="h6">Detail</Typography>
      </AccordionSummary>
      <AccordionDetails className="p-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 w-[320px] gap-3"
        >
          <TextField
            {...register("name", { required: true })}
            label="Název rezervace"
            variant="outlined"
          />
          <TextField
            {...register("purpouse", { required: true })}
            variant="outlined"
            label="Účel rezervace"
          />
          <TextField
            {...register("instructions")}
            className="col-span-2"
            label="Pokyny pro účastníky (dobrovolné)"
          />
          <Controller
            control={control}
            name="leader"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Autocomplete value={value} onChange={(_, value) => onChange(value)} disabled={!isAdmin} className="col-span-2" options={options}
                renderOption={(props: any, option: any) => <li {...props}><span className="flex justify-between w-full">
                  <Typography>{option.name}</Typography>
                  <Typography color="text.secondary">{option.email}</Typography>
                </span></li>} getOptionLabel={(option: any) => option.name} renderInput={(params) => (
                  <TextField {...params} label="Vedoucí" helperText="Vedoucí bude automaticky přidán jako účastník rezervace a může poté spravovat její účastníky." />
                )} />
            )}
          />
          <Button variant="contained" disabled={!isValid || !isDirty} type="submit">
            Uložit
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!reservationValidation}
            onClick={() => {
              setCreateReservation({
                ...createReservation,
                purpouse: "",
                name: "",
                instructions: "",
              });
              reset({ name: "", instructions: "", purpouse: "" })
            }}
          >
            Zrušit
          </Button>
        </form>
      </AccordionDetails>
    </Accordion >
  );
}
