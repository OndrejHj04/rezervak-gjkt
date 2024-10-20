import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormContext } from "react-hook-form";
import { Dayjs } from "dayjs";

export default function DateInput() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <DemoContainer components={["DatePicker"]} sx={{ width: "100%" }}>
      <DatePicker
        label="Datum narození"
        className="md:w-auto w-full"
        format="DD.MM.YYYY"
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
  );
}
