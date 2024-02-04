import { Chip, ListItemText, Paper, Typography } from "@mui/material";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import dayjs from "dayjs";
import Image from "next/image";

const getWeather = async () => {
  const req = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=50.695481&lon=15.735426&appid=${process.env.WEATHER_API}`,
    { cache: "no-cache" }
  );
  const data = await req.json();
  return data;
};

export default async function WeatherWidget() {
  const currentWeather = await getWeather();

  return (
    <Paper className="p-2 flex flex-col">
      <div className="flex justify-between items-center gap-3">
        <ThermostatIcon color="primary" />
        <Typography variant="h5">Aktuální počasí</Typography>
        <ThermostatIcon color="primary" />
      </div>
      <div className="flex flex-col h-full">
        <div className="m-auto flex">
          <Image
            alt="icon"
            src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
            width={72}
            height={72}
          />
          <Typography variant="h2">
            {(currentWeather.main.temp - 273.15).toFixed(1)} °C
          </Typography>
        </div>
        <div>
          <Typography className="text-center" sx={{ opacity: 0.7 }}>
            Datum: {dayjs().format("DD. MM. YYYY")}
          </Typography>
          <Typography className="text-center" sx={{ opacity: 0.7 }}>
            Východ slunce:{" "}
            {dayjs.unix(currentWeather.sys.sunrise).format("HH:mm")}
          </Typography>
          <Typography className="text-center" sx={{ opacity: 0.7 }}>
            Západ slunce:{" "}
            {dayjs.unix(currentWeather.sys.sunset).format("HH:mm")}
          </Typography>
        </div>
      </div>
    </Paper>
  );
}
