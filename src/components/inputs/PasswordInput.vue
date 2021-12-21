<script setup lang="ts">
  import {
    InputHTMLAttributes,
    reactive,
    ref,
    defineProps,
    computed,
    defineEmits,
    onMounted
  } from 'vue'
  import { EyeIcon, EyeOffIcon, KeyIcon } from '@heroicons/vue/outline'
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
    label: {
      type: String,
      default: 'Senha'
    }
  })

  const state = reactive({
    focus: false,
    password: '',
    showPass: false
  })

  const passwordInput = ref<InputHTMLAttributes>({})

  onMounted(() => {
    setTimeout(() => {
      passwordInput.value.disabled = false
    }, 1000)
  })

  const rules = computed(() => ({
    password: {}
  }))

  if (props.required) {
    required.$message = 'Preenchimento do campo é obrigatório!'
    rules.value.password = { required }
  }
  const v$ = useVuelidate(rules, state)

  const classInput = inputClass(
    props.externalDescribeIcon,
    v$.value.password as any
  )

  const classLabelSpan = labelSpanClass(
    props.externalDescribeIcon,
    state,
    'password'
  )

  function onFocus() {
    state.focus = true
  }
  function onBlur() {
    state.focus = false
    v$.value.$touch()
    emit('error', { error: v$.value.$error, propName: 'passwordHasError' })
  }
  function showPass() {
    state.showPass = !state.showPass
    passwordInput.value.type =
      passwordInput.value.type === 'password' ? 'text' : 'password'
  }
</script>

<template>
  <label
    class="relative flex pt-6 mt-2"
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
      <KeyIcon />
    </span>
    <span
      class="absolute transition-all duration-300 font-semibold"
      :class="classLabelSpan"
      >{{ props.label }}</span
    >
    <input
      ref="passwordInput"
      v-model.trim="state.password"
      disabled
      type="password"
      name="password-rde"
      class="w-full border-gray-400 text-gray-800"
      :class="classInput"
      :required="props.required"
      @focus="onFocus"
      @blur="onBlur"
      @input="() => emit('value', state.password)"
    />
    <span
      class="block h-6 w-6 absolute right-2 text-gray-400"
      :class="v$.password.$error ? 'text-red-400' : ''"
      @click.stop.prevent="showPass"
    >
      <EyeIcon v-if="!state.showPass" />
      <EyeOffIcon v-else />
    </span>
  </label>
  <span v-if="v$.password.$error">
    <span v-for="(error, index) of v$.password.$errors" :key="index">
      <small class="ml-2 text-red-600">{{ error.$message }}</small>
    </span>
  </span>
</template>
