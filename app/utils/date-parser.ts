import dayjs from "dayjs"
import "dayjs/locale/pt-br"

export function formatDate(date: Date | null | undefined) {
  if (!date) return ""

  return dayjs(date).locale("pt-br").format("MMM D, YYYY")
}
