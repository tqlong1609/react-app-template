import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ja'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.locale('ja')
dayjs.extend(utc)
dayjs.extend(timezone)

const DATE_FORMAT = 'YYYY-MM-DD'

export const getDate = (date: string, format: string = DATE_FORMAT) => {
  return dayjs(date, format)
}

export const formatDate = (date?: string | Dayjs, format: string = DATE_FORMAT) => {
  if (typeof date === 'object') {
    return date.format(format)
  }
  return dayjs(date).tz('Asia/Tokyo').format(format)
}

export const addDays = (date: string | Dayjs, days: number, format: string = DATE_FORMAT) => {
  if (typeof date === 'string') {
    return dayjs(date).add(days, 'day').format(format)
  }
  return date?.add(days, 'day').format(format) || ''
}

export type { Dayjs }
export default dayjs
