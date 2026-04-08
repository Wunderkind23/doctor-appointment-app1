export function extractTime(isoString: string) {
  const date = new Date(isoString)
  return date.toISOString().slice(11, 16)
}

export const formatTime = (isoString: string): string => {
  const date = new Date(isoString)

  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')

  return `${hours}:${minutes}`
}


export const formatTimeFromMs = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
