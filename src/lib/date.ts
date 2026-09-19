const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

export function formatMonthYear(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  const month = MONTHS[date.getUTCMonth()]
  return `${month} ${date.getUTCFullYear()}`
}

export function formatDateRange(
  startDate: string,
  endDate: string | null,
  isCurrent = false,
): string {
  const start = formatMonthYear(startDate)
  if (isCurrent || endDate === null) {
    return `${start} - Present`
  }
  return `${start} - ${formatMonthYear(endDate)}`
}

export function formatYearRange(
  startYear: number,
  endYear: number | null,
): string {
  if (endYear === null) return `${startYear} - Present`
  return `${startYear} - ${endYear}`
}
