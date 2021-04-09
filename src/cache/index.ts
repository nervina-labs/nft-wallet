const UNIPASS_ADDRESS_KEY = 'unipass_address_key'
const UNIPASS_EMAIL_KEY = 'unipass_email_key'

export const unipassCache = {
  getUnipassAddress(): string | null {
    return localStorage.getItem(UNIPASS_ADDRESS_KEY)
  },
  setUnipassAddress(address: string): void {
    localStorage.setItem(UNIPASS_ADDRESS_KEY, address)
  },
  getUnipassEmail(): string | null {
    return localStorage.getItem(UNIPASS_EMAIL_KEY)
  },
  setUnipassEmail(email: string): void {
    localStorage.setItem(UNIPASS_EMAIL_KEY, email)
  },
}
