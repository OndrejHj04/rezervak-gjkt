import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import Image from "next/image";

const getWeather = async () => {
  const req = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=50.695481&lon=15.735426&appid=${process.env.WEATHER_API}`,
    { cache: "no-cache" }
  );
  const { list } = await req.json();
  return list;
};
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekdays: [
    "Neděle",
    "Pondělí",
    "Úterý",
    "Středa",
    "Čtvrtek",
    "Pátek",
    "Sobota",
  ],
});
export default async function Weather() {
  const weather = (await getWeather()) as any;
  const days = [] as any;

  for (let i = 0; i < weather.length; i++) {
    if (days.length) {
      if (
        dayjs
          .unix(weather[i].dt)
          .isSame(dayjs.unix(days[days.length - 1].date), "day")
      ) {
        days[days.length - 1].data.push(weather[i]);
      } else {
        days.push({
          date: weather[i].dt,
          data: [weather[i]],
        });
      }
    } else {
      days.push({
        date: weather[i].dt,
        data: [weather[i]],
      });
    }
  }

  return (
    <Paper className="p-2">
      <Typography variant="h5">Počasí na následujících 5 dnů</Typography>
      {days.map((day: any) => (
        <Accordion key={day.date}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {dayjs.unix(day.date).format("DD. MM. YYYY dddd")}
          </AccordionSummary>
          <AccordionDetails>
            <List className="grid lg:grid-rows-2 lg:grid-cols-4 sm:grid-rows-4 sm:grid-cols-2">
              {day.data.map((item: any, i: any) => (
                <ListItem key={i}>
                  <ListItemIcon>
                    <Image
                      alt="icon"
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      width={50}
                      height={50}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <div className="flex">
                        <Typography>
                          {dayjs.unix(item.dt).format("HH:mm")}
                        </Typography>
                      </div>
                    }
                    secondary={
                      <>
                        {`${(item.main.temp - 273.15).toFixed(1)}°C, Déšť: ${
                          item.rain ? `${item.rain["3h"]} mm` : "bez děště"
                        }`}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
}
