<script setup lang="ts">
  import { computed, reactive, defineProps, defineEmits, watch } from 'vue'
  import { PencilIcon, HomeIcon } from '@heroicons/vue/outline'
  import { required } from '@vuelidate/validators'
  import { useVuelidate } from '@vuelidate/core'
  import { commonProps, inputClass, labelSpanClass } from './composables'

  const emit = defineEmits(['value', 'error'])

  const props = defineProps({ ...commonProps })

  const state = reactive({
    focus: false,
    address: props.inputValue
  })

  watch(
    () => props.inputValue,
    (newValue: string) => (state.address = newValue)
  )

  const rules = computed(() => ({
    address: {} as any
  }))

  if (props.required) {
    required.$message = 'Preenchimento do campo é obrigatório!'
    rules.value.address = { ...rules.value.address, required }
  }
  const v$ = useVuelidate(rules, state)

  const classInput = inputClass(
    props.externalDescribeIcon,
    v$.value.address as any
  )

  const classLabelSpan = labelSpanClass(
    props.externalDescribeIcon,
    state,
    'address'
  )

  function onFocus() {
    state.focus = true
  }
  function onBlur() {
    state.focus = false
    v$.value.$touch()
    emit('error', { error: v$.value.$error, propName: 'addressHasError' })
  }
</script>

<template>
  <div>
    <label
      class="relative flex pt-6 mt-2 w-full"
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
        <HomeIcon />
      </span>
      <span
        class="absolute transition-all duration-300 font-semibold"
        :class="classLabelSpan"
        >Endereço</span
      >
      <span
        class="block h-6 w-6 absolute right-2 text-gray-400"
        :class="v$.address.$error ? 'text-red-400' : ''"
      >
        <PencilIcon />
      </span>
      <input
        v-model.trim="state.address"
        autocomplete="nop"
        type="text"
        class="w-full border-gray-400 text-gray-800"
        :class="classInput"
        :required="props.required"
        @focus="onFocus"
        @blur="onBlur"
        @input="() => emit('value', state.address)"
      />
    </label>
    <span v-if="v$.address.$error">
      <span v-for="(error, index) of v$.address.$errors" :key="index">
        <small class="ml-2 text-red-600">{{ error.$message }}</small>
      </span>
    </span>
  </div>
</template>
