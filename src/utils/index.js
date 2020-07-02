// 共享项目基建
import dayjs from 'dayjs'

export function formatDate(string, format = 'YYYY-MM-DD HH:MM') {
  return dayjs(string).format(format)
}
