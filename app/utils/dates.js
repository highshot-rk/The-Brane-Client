const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

export function formatDateTitle (date) {
  const formatted = date.toLocaleDateString('en-US', options)
  const today = new Date().toLocaleDateString('en-US', options)

  if (formatted === today) {
    return 'Today'
  }

  return formatted
}

export function formatTime (date) {
  return date.toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
  })
}
