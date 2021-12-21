<script setup lang="ts">
  import { computed, reactive, defineProps, defineEmits } from 'vue'
  import { PencilIcon, MailIcon, RefreshIcon } from '@heroicons/vue/outline'
  import { required } from '@vuelidate/validators'
  import { useVuelidate } from '@vuelidate/core'
  import { commonProps, inputClass, labelSpanClass } from './composables'
  import { cepMask } from '@lbtek/input-masks'
  import { cepValidation } from '../../utils/helpers'
  //import { getAddressByCEP } from '../../services'

  const emit = defineEmits(['value', 'error', 'address'])

  const props = defineProps({ ...commonProps })

  const state = reactive({
    isLoading: false,
    focus: false,
    cep: props.inputValue
  })

  const rules = computed(() => ({
    cep: {
      cepValidator: cepValidation(state)
    } as any
  }))

  if (props.required) {
    required.$message = 'Preenchimento do campo é obrigatório!'
    rules.value.cep = { ...rules.value.cep, required }
  }
  const v$ = useVuelidate(rules, state)

  const classInput = inputClass(props.externalDescribeIcon, v$.value.cep as any)

  const classLabelSpan = labelSpanClass(
    props.externalDescribeIcon,
    state,
    'cep'
  )

  function onFocus() {
    state.focus = true
  }

  function onBlur() {
    state.focus = false
    v$.value.$touch()
    emit('error', { error: v$.value.$error, propName: 'cepHasError' })
  }

  function cepInput(e: KeyboardEvent): void {
    const element = e.target as HTMLInputElement

    if (element.value !== state.cep) cepMask(e)

    emit('value', element.value)

    state.cep = element.value
    /* ;(async () => {
      if (element.value.length === 10) {
        const cep = element.value.replace('.', '')
        state.isLoading = true
        const address = await getAddressByCEP(cep).catch(
          () => (state.isLoading = false)
        )
        state.isLoading = false
        emit('address', address)
      }
    })() */
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
        <MailIcon />
      </span>
      <span
        class="absolute transition-all duration-300 font-semibold"
        :class="classLabelSpan"
        >CEP</span
      >
      <span
        class="block h-6 w-6 absolute right-2 text-gray-400"
        :class="v$.cep.$error ? 'text-red-400' : ''"
      >
        <PencilIcon v-if="!state.isLoading" />
        <div v-else>
          <span class="animate-spin block h-6 w-6 m-auto text-gray-500">
            <RefreshIcon class="scale-x-[-1]" />
          </span>
        </div>
      </span>
      <input
        v-model.lazy="state.cep"
        autocomplete="nop"
        type="text"
        maxlength="10"
        class="w-full border-gray-400 text-gray-800"
        :class="classInput"
        :required="props.required"
        @focus="onFocus"
        @blur="onBlur"
        @keyup="cepInput"
      />
    </label>
    <span v-if="v$.cep.$error">
      <span v-for="(error, index) of v$.cep.$errors" :key="index">
        <small class="ml-2 text-red-600">{{ error.$message }}</small>
      </span>
    </span>
  </div>
</template>
