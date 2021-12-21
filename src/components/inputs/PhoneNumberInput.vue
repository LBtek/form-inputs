<script setup lang="ts">
  import { computed, reactive, defineProps, defineEmits } from 'vue'
  import { PencilIcon, PhoneIcon } from '@heroicons/vue/outline'
  import { required } from '@vuelidate/validators'
  import { useVuelidate } from '@vuelidate/core'
  import { commonProps, inputClass, labelSpanClass } from './composables'
  import { phoneMask } from '@lbtek/input-masks'
  import { phoneValidation } from '../../utils/helpers'

  const emit = defineEmits(['value', 'error'])

  const props = defineProps({
    ...commonProps,
    label: {
      type: String,
      default: 'Telefone'
    }
  })

  const state = reactive({
    focus: false,
    phoneNumber: props.inputValue
  })

  const rules = computed(() => ({
    phoneNumber: {
      phoneValidator: phoneValidation(state)
    } as any
  }))

  if (props.required) {
    required.$message = 'Preenchimento do campo é obrigatório!'
    rules.value.phoneNumber = { ...rules.value.phoneNumber, required }
  }
  const v$ = useVuelidate(rules, state)

  const classInput = inputClass(
    props.externalDescribeIcon,
    v$.value.phoneNumber as any
  )

  const classLabelSpan = labelSpanClass(
    props.externalDescribeIcon,
    state,
    'phoneNumber'
  )

  function onFocus() {
    state.focus = true
  }
  function onBlur() {
    state.focus = false
    v$.value.$touch()
    emit('error', {
      error: v$.value.$error,
      propName: 'phoneNumberHasError'
    })
  }

  function phoneNumberInput(e: KeyboardEvent) {
    const element = e.target as HTMLInputElement
    if (element.value !== state.phoneNumber) phoneMask(e)
    emit('value', element.value)
    state.phoneNumber = element.value
  }
</script>

<template>
  <div>
    <label
      class="relative flex pt-6 mt-2 w-full col-span-2"
      :class="
        props.externalDescribeIcon ? 'items-center' : 'flex-col justify-center'
      "
    >
      <span
        v-if="props.externalDescribeIcon"
        class="
          flex
          items-center
          justify-center
          h-6
          w-6
          bg-gray-400
          border border-gray-400
          text-white
          rounded-l-md
          p-2
          box-content
        "
      >
        <PhoneIcon />
      </span>
      <span
        class="absolute transition-all duration-300 font-semibold"
        :class="classLabelSpan"
        >{{ props.label }}</span
      >
      <span
        class="block h-6 w-6 absolute right-2 text-gray-400"
        :class="v$.phoneNumber.$error ? 'text-red-400' : ''"
      >
        <PencilIcon />
      </span>
      <input
        v-model.lazy="state.phoneNumber"
        autocomplete="nop"
        type="text"
        maxlength="15"
        class="w-full border-gray-400 text-gray-800"
        :class="classInput"
        :required="props.required"
        @focus="onFocus"
        @blur="onBlur"
        @keyup="phoneNumberInput"
      />
    </label>
    <span v-if="v$.phoneNumber.$error">
      <span v-for="(error, index) of v$.phoneNumber.$errors" :key="index">
        <small class="ml-2 text-red-600">{{ error.$message }}</small>
      </span>
    </span>
  </div>
</template>
