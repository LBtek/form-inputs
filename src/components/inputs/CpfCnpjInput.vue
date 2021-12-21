<script setup lang="ts">
  import { computed, reactive, defineProps, defineEmits } from 'vue'
  import { PencilIcon, IdentificationIcon } from '@heroicons/vue/outline'
  import { required } from '@vuelidate/validators'
  import { useVuelidate } from '@vuelidate/core'
  import { commonProps, inputClass, labelSpanClass } from './composables'
  import { cpfCnpjMask } from '@lbtek/input-masks'
  import { cpfCnpjValidation } from '../../utils/helpers'

  const emit = defineEmits(['value', 'error'])

  const props = defineProps({
    ...commonProps,
    disabled: {
      type: Boolean,
      default: false
    }
  })

  const state = reactive({
    focus: false,
    cpf_cnpj: props.inputValue
  })

  const rules = computed(() => ({
    cpf_cnpj: {
      cpfCnpjValidator: cpfCnpjValidation(state)
    } as any
  }))

  if (props.required) {
    required.$message = 'Preenchimento do campo é obrigatório!'
    rules.value.cpf_cnpj = { ...rules.value.cpf_cnpj, required }
  }
  const v$ = useVuelidate(rules, state)

  const classInput = inputClass(
    props.externalDescribeIcon,
    v$.value.cpf_cnpj as any
  )

  const classLabelSpan = labelSpanClass(
    props.externalDescribeIcon,
    state,
    'cpf_cnpj'
  )

  function onFocus() {
    state.focus = true
  }

  function onBlur() {
    state.focus = false
    v$.value.$touch()
    emit('error', {
      error: v$.value.$error,
      propName: 'registrationIdHasError'
    })
  }

  function cpfCnpjInput(e: KeyboardEvent) {
    const element = e.target as HTMLInputElement
    if (element.value !== state.cpf_cnpj) cpfCnpjMask(e)
    emit('value', element.value)
    state.cpf_cnpj = element.value
  }
</script>

<template>
  <div>
    <label
      class="relative flex pt-6 mt-2 w-full col-span-3"
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
          h-7
          w-7
          bg-gray-400
          border border-gray-400
          text-white
          rounded-l-md
          p-[6px]
          box-content
        "
      >
        <IdentificationIcon />
      </span>
      <span
        class="absolute transition-all duration-300 font-semibold"
        :class="classLabelSpan"
        >CPF ou CNPJ</span
      >
      <span
        class="block h-6 w-6 absolute right-2 text-gray-400"
        :class="v$.cpf_cnpj.$error ? 'text-red-400' : ''"
      >
        <PencilIcon />
      </span>
      <input
        v-model.lazy="state.cpf_cnpj"
        autocomplete="nop"
        type="text"
        maxlength="18"
        class="w-full border-gray-400 text-gray-800"
        :class="classInput"
        :required="props.required"
        :disabled="props.disabled"
        @focus="onFocus"
        @blur="onBlur"
        @keyup="cpfCnpjInput"
      />
      <div
        v-if="props.disabled"
        class="absolute w-full h-full translate-y-[-4px] bg-white bg-opacity-40"
      ></div>
    </label>
    <span v-if="v$.cpf_cnpj.$error">
      <span v-for="(error, index) of v$.cpf_cnpj.$errors" :key="index">
        <small class="ml-2 text-red-600">{{ error.$message }}</small>
      </span>
    </span>
  </div>
</template>
