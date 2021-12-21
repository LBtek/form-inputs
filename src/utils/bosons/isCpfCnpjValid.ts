export function isCpfCnpjValid(value: string): boolean {
  value = value.replace(/\D/g, '')
  if (value.length !== 11 && value.length !== 14) return false
  else {
    if (value.match(/^(\d)\1*$/)?.length) return false
    if (value.length === 11) {
      let sum
      let rest
      sum = 0

      for (let i = 1; i <= 9; i++)
        sum = sum + parseInt(value.substring(i - 1, i)) * (11 - i)
      rest = (sum * 10) % 11

      if (rest == 10 || rest == 11) rest = 0
      if (rest != parseInt(value.substring(9, 10))) return false

      sum = 0

      for (let i = 1; i <= 10; i++)
        sum = sum + parseInt(value.substring(i - 1, i)) * (12 - i)
      rest = (sum * 10) % 11

      if (rest == 10 || rest == 11) rest = 0
      if (rest != parseInt(value.substring(10, 11))) return false
    }
    if (value.length === 14) {
      let length = value.length - 2
      let numbers = value.substring(0, length)
      const digits = value.substring(length)
      let sum = 0
      let pos = length - 7

      for (let i = length; i >= 1; i--) {
        sum += Number(numbers.charAt(length - i)) * pos--
        if (pos < 2) pos = 9
      }

      let resultado = sum % 11 < 2 ? 0 : 11 - (sum % 11)

      if (resultado != Number(digits.charAt(0))) return false

      length = length + 1
      numbers = value.substring(0, length)
      sum = 0
      pos = length - 7

      for (let i = length; i >= 1; i--) {
        sum += Number(numbers.charAt(length - i)) * pos--
        if (pos < 2) pos = 9
      }
      resultado = sum % 11 < 2 ? 0 : 11 - (sum % 11)

      if (resultado != Number(digits.charAt(1))) return false
    }
  }

  return true
}
