const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const useFormatDate = () => {
  const formatDate = (date: string | null): string => {
    if (!date) return ''

    if (date.includes('/')) {
      const [month, year] = date.split('/')
      return `${MONTHS[parseInt(month) - 1]} ${year}`
    }

    const d = new Date(date)
    if (isNaN(d.getTime())) return date
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
  }

  return { formatDate }
}
