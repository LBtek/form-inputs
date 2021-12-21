export function isPhoneNumberValid(value: string): boolean {
  value = value.replace(/\D/g, '')
  if (value.length !== 10 && value.length !== 11) return false
  else return true
}
