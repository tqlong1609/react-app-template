import { formatToTimeZone } from 'date-fns-timezone'

const TIME_ZONE_TOKYO = 'Asia/Tokyo'

export const formatDatetime = (dateTime: string): string => {
  const FORMAT = 'YYYY/MM/DD HH:mm:ss'
  return formatToTimeZone(dateTime, FORMAT, { timeZone: TIME_ZONE_TOKYO })
}
