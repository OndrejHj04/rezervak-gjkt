import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { csCZ } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import CzechLocale from "dayjs/locale/cs";

export default function ReservationCalendar({
  from,
  to,
}: {
  from?: string;
  to?: string;
}) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={CzechLocale as any}
      localeText={
        csCZ.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      {from && <DateCalendar disableHighlightToday value={dayjs(from)} />}
      {to && <DateCalendar disableHighlightToday value={dayjs(to)} />}
    </LocalizationProvider>
  );
}
