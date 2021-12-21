import { ValidationRuleWithParams } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { isCepValid } from '../../utils/bosons'

const phoneNumberValidator = (value: string) =>
  !helpers.req(value) || isCepValid(value)

const cepErrorMsg = (cep: string) => {
  cep = cep.replace(/\D/g, '')
  let msg = ''
  if (cep.length !== 8) msg = 'Formato inválido de CEP!'

  return msg
}

export const cepValidation = (stateRef: any): ValidationRuleWithParams =>
  helpers.withMessage(() => cepErrorMsg(stateRef.cep), phoneNumberValidator)
