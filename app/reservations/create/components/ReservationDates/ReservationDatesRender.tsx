"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { Reservations } from "@/types";
import {
  DateCalendar,
  DatePicker,
  DatePickerToolbar,
  LocalizationProvider,
  PickersDay,
  StaticDatePicker,
  csCZ,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CzechLocale from "dayjs/locale/cs";
import dayjs from "dayjs";
import * as isBetween from "dayjs/plugin/isBetween";
import CancelIcon from "@mui/icons-material/Cancel";
import { useForm } from "react-hook-form";
dayjs.extend(isBetween as any);

function makeDay(props: any) {
  const {
    outsideCurrentMonth,
    setSelectedDates,
    selectedDates,
    reservations,
    day,
    ...other
  } = props;

  const isReservation = reservations.some(
    ({ from_date, to_date }: { from_date: string; to_date: string }) =>
      dayjs(day).isBetween(from_date, to_date, null, "[]")
  );

  const isSelected =
    dayjs(day).isSame(selectedDates[0], "day") ||
    dayjs(day).isSame(selectedDates[1], "day");

  const selectDate = () => {
    if (!isReservation) {
      if (selectedDates[0]) {
        setSelectedDates([selectedDates[0], day]);
      } else {
        setSelectedDates([day, selectedDates[1]]);
      }
    }
  };

  return (
    <PickersDay
      {...other}
      onClick={selectDate}
      sx={{ backgroundColor: isSelected && "success.main" }}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
    />
  );
}

export default function ReservationDatesRender({
  reservations,
}: {
  reservations: Reservations[];
}) {
  const [expanded, setExpanded] = useState(true);
  const isValid = true;
  const [selectedDates, setSelectedDates] = useState<any[]>([null, null]);
  console.log(selectedDates);
  const { handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Accordion expanded={expanded}>
        <AccordionSummary
          onClick={() => setExpanded((c) => !c)}
          expandIcon={
            isValid && !expanded ? (
              <CheckCircleIcon color="success" />
            ) : (
              <ExpandMoreIcon />
            )
          }
        >
          <div className="flex gap-5 items-center">
            <Typography variant="h6">Termín rezervace</Typography>
            <Typography>17. 6. 2020 - 14. 8. 2021</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={CzechLocale as any}
            localeText={
              csCZ.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <div className="flex">
              <DateCalendar
                value={null}
                sx={{ margin: 0 }}
                slots={{
                  day: makeDay,
                }}
                slotProps={{
                  day: {
                    reservations: reservations.map(
                      ({ from_date, to_date }) => ({
                        from_date,
                        to_date,
                      })
                    ),
                    selectedDates,
                    setSelectedDates,
                  } as any,
                }}
              />
              <div className="flex flex-col gap-1">
                <TextField
                  label="Začátek rezervace"
                  value={
                    selectedDates[0]
                      ? dayjs(selectedDates[0]).format("DD. MM. YYYY")
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="error"
                          disabled={!selectedDates[0]}
                          onClick={() =>
                            setSelectedDates((day) => [null, day[1]])
                          }
                        >
                          <CancelIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Konec rezervace"
                  value={
                    selectedDates[1]
                      ? dayjs(selectedDates[1]).format("DD. MM. YYYY")
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="error"
                          disabled={!selectedDates[1]}
                          onClick={() =>
                            setSelectedDates((day) => [day[0], null])
                          }
                        >
                          <CancelIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button>Uložit</Button>
              </div>
            </div>
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>
    </form>
  );
}
