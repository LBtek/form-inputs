export function isCepValid(value: string): boolean {
  value = value.replace(/\D/g, '')
  if (value.length !== 8) return false
  else return true
}
