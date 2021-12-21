<script setup lang="ts">
  import { computed, reactive, defineProps, defineEmits, watch } from 'vue'
  import { PencilIcon, MapIcon } from '@heroicons/vue/outline'
  import { required } from '@vuelidate/validators'
  import { useVuelidate } from '@vuelidate/core'
  import { inputClass, labelSpanClass } from './composables'

  const emit = defineEmits(['value', 'error'])

  const props = defineProps({
    required: {
      type: Boolean,
      default: false
    },
    externalDescribeIcon: {
      type: Boolean,
      default: true
    },
    inputValue: {
      type: String,
      default: ''
    }
  })

  const state = reactive({
    focus: false,
    state: props.inputValue
  })

  watch(
    () => props.inputValue,
    (newValue: string) => (state.state = newValue)
  )

  const rules = computed(() => ({
    state: {} as any
  }))

  if (props.required) {
    required.$message = 'Preenchimento do campo é obrigatório!'
    rules.value.state = { ...rules.value.state, required }
  }
  const v$ = useVuelidate(rules, state)

  const classInput = inputClass(
    props.externalDescribeIcon,
    v$.value.state as any
  )

  const classLabelSpan = labelSpanClass(
    props.externalDescribeIcon,
    state,
    'state'
  )
  const statesList = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO'
  ]
  function onFocus() {
    state.focus = true
  }
  function onBlur() {
    state.focus = false
    v$.value.$touch()
    emit('error', { error: v$.value.$error, propName: 'stateHasError' })
  }

  function stateInput(e: Event) {
    const element = e.target as HTMLInputElement
    element.value = element.value.replace(/\d/g, '').toUpperCase()

    if (element.value.length === 1)
      element.value = element.value.replace(/[^ABCDEGMPRST]/, '')

    element.value = element.value.replace(/[^ABCDEFGILMNOPRST]/, '')

    if (element.value.length === 2) {
      if (statesList.includes(element.value)) {
        emit('value', element.value)
        state.state = element.value
      } else element.value = element.value.slice(0, 1)
    }

    if (element.value.length > 2) {
      element.value = element.value.slice(0, 2)
    }
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
        <MapIcon />
      </span>
      <span
        class="absolute transition-all duration-300 font-semibold"
        :class="classLabelSpan"
        >Estado</span
      >
      <span
        class="block h-6 w-6 absolute right-2 text-gray-400"
        :class="v$.state.$error ? 'text-red-400' : ''"
      >
        <PencilIcon />
      </span>
      <input
        v-model.lazy.trim="state.state"
        type="text"
        list="states"
        autocomplete="nop"
        maxlength="2"
        class="w-full border-gray-400 text-gray-800"
        :class="classInput"
        :required="props.required"
        @focus="onFocus"
        @blur="onBlur"
        @input="stateInput"
      />
      <datalist id="states">
        <option
          v-for="(regionState, idx) in statesList"
          :key="`${idx}-${regionState}`"
          :value="regionState"
        ></option>
      </datalist>
    </label>
    <span v-if="v$.state.$error">
      <span v-for="(error, index) of v$.state.$errors" :key="index">
        <small class="ml-2 text-red-600">{{ error.$message }}</small>
      </span>
    </span>
  </div>
</template>
