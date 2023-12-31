import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormContext } from "react-hook-form";
import { Dayjs } from "dayjs";

export default function DateInput() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    setError,
  } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          label="Datum narození"
          sx={{ width: 215 }}
          slotProps={{
            textField: {
              helperText: errors.birth_date?.message as string,
              error: errors.birth_date?.message ? true : false,
            },
          }}
          {...register("birth_date", {
            required: "Toto pole je povinné",
            pattern: {
              value: /^\d{4}-\d{2}-\d{2}$/,
              message: "Neplatné datum",
            },
          })}
          onChange={(date: Dayjs | null) => {
            setValue("birth_date", date?.format("YYYY-MM-DD"));
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
