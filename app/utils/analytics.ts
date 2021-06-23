import posthog from 'posthog-js'

const isEnabled = location.hostname !== 'localhost' && !location.hostname.includes('staging')

if (isEnabled) {
  posthog.init('kvlTf22uxZbyQPrr1UP7yXp6ta_AwgA-SCQxDBrxmnw', { api_host: 'https://posthog.thebrane.com' })
}

export function trackEvent (name: string, data?: any): void {
  if (isEnabled) {
    posthog.capture(name, data)
  }
}
