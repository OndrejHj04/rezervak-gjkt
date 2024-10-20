"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm } from "react-hook-form";
import { store } from "@/store/store";

export default function ReservationDetailRender({ id }: { id: any }) {
  const { createReservation, setCreateReservation } = store();
  const [expanded, setExpanded] = useState(false);
  const reservationValidation =
    createReservation.name && createReservation.purpouse;
  const {
    handleSubmit,
    formState: { isValid },
    register,
    reset,
  } = useForm();

  const onSubmit = (data: any) => {
    setCreateReservation({
      ...createReservation,
      leader: id,
      purpouse: data.purpouse,
      instructions: data.instructions,
      name: data.name,
    });
    setExpanded(false);
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
        <div className="flex gap-5 items-center">
          <Typography variant="h6">Detail rezervace</Typography>
          {!!createReservation.name && (
            <Typography>Název rezervace: {createReservation.name}</Typography>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-2 md:flex-row flex-col"
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 md:flex-row flex-col">
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
            </div>
            <TextField
              {...register("instructions")}
              label="Pokyny pro účastníky (dobrovolné)"
              multiline
              maxRows={4}
              minRows={4}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="contained" disabled={!isValid} type="submit">
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
                reset({
                  purpouse: "",
                  instructions: "",
                  name: "",
                });
              }}
            >
              Zrušit
            </Button>
          </div>
        </form>
      </AccordionDetails>
    </Accordion>
  );
}
