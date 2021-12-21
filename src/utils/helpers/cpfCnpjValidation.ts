import { ValidationRuleWithParams } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { isCpfCnpjValid } from '../../utils/bosons'

const cpfCnpjValidator = (value: string) =>
  !helpers.req(value) || isCpfCnpjValid(value)

const cpfCnpjErrorMsg = (cpf_cnpj: string) => {
  let msg = ''
  if (cpf_cnpj.length === 18) msg = 'CNPJ inválido!'
  if (cpf_cnpj.length < 18) msg = 'Formato inválido de CNPJ'
  if (cpf_cnpj.length === 14) msg = 'CPF inválido!'
  if (cpf_cnpj.length < 14) msg = 'Formato inválido de CPF!'

  return msg
}

export const cpfCnpjValidation = (stateRef: any): ValidationRuleWithParams =>
  helpers.withMessage(
    () => cpfCnpjErrorMsg(stateRef.cpf_cnpj),
    cpfCnpjValidator
  )
