import { computed, ComputedRef } from 'vue'

export function labelSpanClass(
  externalDescribeIcon: boolean,
  state: any,
  statePropName: string
): ComputedRef<string[]> {
  return computed(() => {
    const labelSpanClass = []

    labelSpanClass.push(
      state.focus || state[statePropName]
        ? 'text-sm text-gray-700 top-1'
        : 'top-1/2 text-gray-500'
    )

    if (externalDescribeIcon)
      labelSpanClass.push(
        state.focus || state[statePropName] ? 'left-10' : 'left-14'
      )
    else
      labelSpanClass.push(
        state.focus || state[statePropName] ? 'left-2' : 'left-4'
      )

    return labelSpanClass
  })
}
