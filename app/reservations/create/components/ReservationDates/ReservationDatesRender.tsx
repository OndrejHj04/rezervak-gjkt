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
            <div className="flex gap-2">
              <StaticDatePicker
                sx={{ width: 200 }}
                value={selectedDates[0]}
                shouldDisableDate={(date) =>
                  reservations.some((r) =>
                    dayjs(date).isBetween(r.from_date, r.to_date, "day", "[]")
                  )
                }
                onChange={(date) => setSelectedDates([date, selectedDates[1]])}
                disableHighlightToday
                slotProps={{ actionBar: { actions: ["cancel"] } }}
              />
              <StaticDatePicker
                sx={{ width: 200 }}
                value={selectedDates[1]}
                shouldDisableDate={(date) =>
                  reservations.some((r) =>
                    dayjs(date).isBetween(r.from_date, r.to_date, "day", "[]")
                  )
                }
                onChange={(date) => setSelectedDates([selectedDates[0], date])}
                disableHighlightToday
                slotProps={{ actionBar: { actions: ["cancel"] } }}
              />
            </div>
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>
    </form>
  );
}
