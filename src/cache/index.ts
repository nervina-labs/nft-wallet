const UNIPASS_ADDRESS_KEY = 'unipass_address_key'
const UNIPASS_EMAIL_KEY = 'unipass_email_key'
const UNIPASS_LOGIN_DATE = 'unipass_login_date'

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
  getUnipassLoginDate(): string | null {
    return localStorage.getItem(UNIPASS_LOGIN_DATE)
  },
  setUnipassLoginDate(date: string) {
    localStorage.setItem(UNIPASS_LOGIN_DATE, date)
  },
}
