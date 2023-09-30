import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormContext } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
export default function DateInput() {
  const { register, setValue } = useFormContext();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          label="Datum narození"
          sx={{ width: 215 }}
          {...register("birth_date")}
          onChange={(date: Dayjs | null) =>
            setValue("birth_date", date?.format("YYYY-MM-DD"))
          }
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
