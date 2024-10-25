import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/cs';

dayjs.extend(relativeTime)

export const smartTime = (date: any) => {
  return dayjs().locale('cs').to(date)
}
