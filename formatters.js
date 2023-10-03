export function formatDate(dateString) {
  if (!dateString) return null
  const now = new Date()
  const date = new Date(dateString)

  // Calculate the time difference
  const diff = Math.abs(now - date)

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) {
    return 'just now'
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute)
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`
  } else if (diff < day) {
    const hours = Math.floor(diff / hour)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diff < month) {
    const days = Math.floor(diff / day)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (diff < year) {
    const months = Math.floor(diff / month)
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(diff / year)
    return `${years} year${years > 1 ? 's' : ''} ago`
  }
}
export function generateFormattedDateTime(dateString) {
  if (!dateString) return null
  let date = new Date(dateString)

  let year = date.getFullYear()
  let month = ('0' + (date.getMonth() + 1)).slice(-2)
  let day = ('0' + date.getDate()).slice(-2)

  let hour = ('0' + date.getHours()).slice(-2)
  let minute = ('0' + date.getMinutes()).slice(-2)
  let second = ('0' + date.getSeconds()).slice(-2)

  let formattedDateTime = `${year}-${month}-${day}, ${hour}:${minute}:${second}`

  return formattedDateTime
}
export function formatMoneyWithCommas(number) {
   // Convert the number to a string and split it into parts
   const parts = number.toString().split('.')

   // Format the integer part with commas
   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

   // Join the integer and decimal parts (if any)
   return parts.join('.')
 }
