<script setup lang="ts">
  import { computed, reactive, defineProps, defineEmits, watch } from 'vue'
  import { PencilIcon, HashtagIcon } from '@heroicons/vue/outline'
  import { required } from '@vuelidate/validators'
  import { useVuelidate } from '@vuelidate/core'
  import { commonProps, inputClass, labelSpanClass } from './composables'

  const emit = defineEmits(['value', 'error'])

  const props = defineProps({ ...commonProps })

  const state = reactive({
    focus: false,
    number: props.inputValue
  })

  watch(
    () => props.inputValue,
    (newValue: string) => (state.number = newValue)
  )

  const rules = computed(() => ({
    number: {} as any
  }))

  if (props.required) {
    required.$message = 'Preenchimento do campo é obrigatório!'
    rules.value.number = { ...rules.value.number, required }
  }
  const v$ = useVuelidate(rules, state)

  const classInput = inputClass(
    props.externalDescribeIcon,
    v$.value.number as any
  )

  const classLabelSpan = labelSpanClass(
    props.externalDescribeIcon,
    state,
    'number'
  )

  function onFocus() {
    state.focus = true
  }
  function onBlur() {
    state.focus = false
    v$.value.$touch()
    emit('error', { error: v$.value.$error, propName: 'numberHasError' })
  }
  function numberInput(e: Event): void {
    const element = e.target as HTMLInputElement
    element.value = element.value.replace(/\D/g, '')
    emit('value', element.value)
    state.number = element.value
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
          font-semibold
        "
      >
        <HashtagIcon />
      </span>
      <span
        class="absolute transition-all duration-300 font-semibold"
        :class="classLabelSpan"
        >Número</span
      >
      <span
        class="block h-6 w-6 absolute right-2 text-gray-400"
        :class="v$.number.$error ? 'text-red-400' : ''"
      >
        <PencilIcon />
      </span>
      <input
        v-model.lazy.trim="state.number"
        autocomplete="nop"
        type="text"
        maxlength="6"
        class="w-full border-gray-400 text-gray-800"
        :class="classInput"
        :required="props.required"
        @focus="onFocus"
        @blur="onBlur"
        @input="numberInput"
      />
    </label>
    <span v-if="v$.number.$error">
      <span v-for="(error, index) of v$.number.$errors" :key="index">
        <small class="ml-2 text-red-600">{{ error.$message }}</small>
      </span>
    </span>
  </div>
</template>
