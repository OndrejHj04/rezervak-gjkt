"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Controller, useForm } from "react-hook-form";
import { User } from "next-auth";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { useSession } from "next-auth/react";
import { store } from "@/store/store";
import ScrollBar from "react-perfect-scrollbar";

export default function ReservationDetailRender({ users }: { users: User[] }) {
  const { data } = useSession();
  const { createReservation, setCreateReservation } = store();
  const [expanded, setExpanded] = useState(false);
  const reservationValidation =
    createReservation.leader && createReservation.purpouse;
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    setValue,
    register,
    watch,
    reset,
  } = useForm();
  const [loading, setLoading] = useState(true);
  const onSubmit = (data: any) => {
    setCreateReservation({
      ...createReservation,
      leader: data.leader.id,
      purpouse: data.purpouse,
      instructions: data.instructions,
      name: data.name,
    });
    setExpanded(false);
  };

  useEffect(() => {
    if (data?.user) {
      setValue(
        "leader",
        users.find((user) => user.id === data?.user.id)
      );
      setLoading(false);
    }
  }, [data?.user]);

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
          {!!createReservation.leader && (
            <Typography>
              Vedoucí{" "}
              {
                users.find((user) => user.id === createReservation.leader)
                  ?.full_name
              }
            </Typography>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
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
              {loading ? (
                <></>
              ) : (
                <Controller
                  control={control}
                  {...register("leader", { required: true })}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      sx={{ width: 250 }}
                      options={users}
                      getOptionLabel={(option) =>
                        `${option.first_name} ${option.last_name}`
                      }
                      value={value}
                      onChange={(e, data) => onChange(data)}
                      renderOption={(props, option) => (
                        <div {...(props as any)}>
                          <Box className="flex items-center gap-2">
                            <AvatarWrapper data={option} />
                            <Typography className="ml-2">
                              {option.first_name} {option.last_name}
                            </Typography>
                          </Box>
                        </div>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} label="Vedoucí rezervace" />
                      )}
                    />
                  )}
                />
              )}
            </div>
            <TextField
              {...register("instructions")}
              label="Pokyny pro účastníky"
              multiline
              maxRows={4}
              minRows={4}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="contained"
              disabled={!isValid || Boolean(reservationValidation)}
              type="submit"
            >
              Uložit
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={!reservationValidation}
              onClick={() => {
                setCreateReservation({
                  ...createReservation,
                  leader: 0,
                  purpouse: "",
                  name: "",
                });
                reset({
                  purpouse: "",
                  instructions: "",
                  leader: users.find((user) => user.id === data?.user.id),
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
