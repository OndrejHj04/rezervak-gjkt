import dayjs from "dayjs";

export default function NewReservationMember(
  reservation: any,
  type: "add" | "remove"
) {
  return `
  V aplikaci rezervačního systému školní chaty byl Váš účet ${type === "add" ? "<b>přidán</b> do" : "<b>odebrán</b> z"} nadcházející rezervace.<br/>
  Detail rezervace:
  <ul>
    <li>Datum: ${dayjs(reservation.from_date).format("DD.MM.YYYY")} - ${dayjs(
    reservation.to_date
  ).format("DD.MM.YYYY")}</li>
    <li>Vedoucí: ${reservation.leader.first_name} ${
    reservation.leader.last_name
  }</li>
    <li>Pokyny: ${reservation.instructions || "-"}</li>
  </ul>
  `;
}
