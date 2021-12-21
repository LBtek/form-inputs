import { ValidationRuleWithParams } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { isPhoneNumberValid } from '../../utils/bosons'

const phoneNumberValidator = (value: string) =>
  !helpers.req(value) || isPhoneNumberValid(value)

const phoneErrorMsg = (phoneNumber: string) => {
  phoneNumber = phoneNumber.replace(/\D/g, '')
  let msg = ''
  if (phoneNumber.length !== 10 && phoneNumber.length !== 11)
    msg = 'Formato inválido de telefone!'

  return msg
}

export const phoneValidation = (stateRef: any): ValidationRuleWithParams =>
  helpers.withMessage(
    () => phoneErrorMsg(stateRef.phoneNumber),
    phoneNumberValidator
  )
