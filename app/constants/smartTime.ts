import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/cs';

dayjs.extend(relativeTime)
dayjs.locale('cs');

export const smartTime = (date: any) => {
  return dayjs().to(date)
}
