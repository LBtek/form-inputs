import { Validation } from '@vuelidate/core'
import { computed, ComputedRef } from 'vue'

export function inputClass(
  externalDescribeIcon: boolean,
  validation: Validation<any>
): ComputedRef<string[]> {
  return computed(() => {
    const inputClass = []

    if (externalDescribeIcon) inputClass.push('rounded-r-md')
    else inputClass.push('rounded-md')

    inputClass.push(
      validation.$error
        ? 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
        : ''
    )

    return inputClass
  })
}
