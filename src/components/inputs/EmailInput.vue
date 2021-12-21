<script setup lang="ts">
  import { computed, reactive, defineProps, defineEmits } from 'vue'
  import { MailIcon, AtSymbolIcon } from '@heroicons/vue/outline'
  import { email, required } from '@vuelidate/validators'
  import { useVuelidate } from '@vuelidate/core'
  import { commonProps, inputClass, labelSpanClass } from './composables'

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
    email: props.inputValue
  })

  email.$message = 'Formato inválido de e-mail!'
  required.$message = 'Preenchimento do campo é obrigatório!'

  const rules = computed(() => ({
    email: { email } as any
  }))

  if (props.required) {
    rules.value.email = { ...rules.value.email, required }
  }
  const v$ = useVuelidate(rules, state)

  const classInput = inputClass(
    props.externalDescribeIcon,
    v$.value.email as any
  )

  const classLabelSpan = labelSpanClass(
    props.externalDescribeIcon,
    state,
    'email'
  )

  function onFocus() {
    state.focus = true
  }
  function onBlur() {
    state.focus = false
    v$.value.$touch()
    emit('error', { error: v$.value.$error, propName: 'emailHasError' })
  }
</script>

<template>
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
      <AtSymbolIcon />
    </span>
    <span
      class="absolute transition-all duration-300 font-semibold"
      :class="classLabelSpan"
      >E-mail</span
    >
    <span
      class="block h-6 w-6 absolute right-2 text-gray-400"
      :class="v$.email.$error ? 'text-red-400' : ''"
    >
      <MailIcon />
    </span>
    <input
      v-model.trim="state.email"
      type="email"
      name="email-rde"
      class="w-full border-gray-400 text-gray-800"
      :class="classInput"
      :required="props.required"
      :disabled="props.disabled"
      @focus="onFocus"
      @blur="onBlur"
      @input="() => emit('value', state.email)"
    />
    <div
      v-if="props.disabled"
      class="absolute w-full h-full translate-y-[-4px] bg-white bg-opacity-40"
    ></div>
  </label>
  <span v-if="v$.email.$error">
    <span v-for="(error, index) of v$.email.$errors" :key="index">
      <small class="ml-2 text-red-600">{{ error.$message }}</small>
    </span>
  </span>
</template>
