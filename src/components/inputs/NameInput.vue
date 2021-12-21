<script setup lang="ts">
  import { computed, reactive, defineProps, defineEmits } from 'vue'
  import {
    PencilIcon,
    DocumentTextIcon,
    UserIcon
  } from '@heroicons/vue/outline'
  import { required } from '@vuelidate/validators'
  import { useVuelidate } from '@vuelidate/core'
  import { commonProps, inputClass, labelSpanClass } from './composables'

  const emit = defineEmits(['value', 'error'])

  const props = defineProps({
    ...commonProps,
    isEnterprise: {
      type: Boolean,
      default: false
    }
  })

  const state = reactive({
    focus: false,
    name: props.inputValue
  })

  const rules = computed(() => ({
    name: {} as any
  }))

  if (props.required) {
    required.$message = 'Preenchimento do campo é obrigatório!'
    rules.value.name = { ...rules.value.name, required }
  }
  const v$ = useVuelidate(rules, state)

  const classInput = inputClass(
    props.externalDescribeIcon,
    v$.value.name as any
  )

  const classLabelSpan = labelSpanClass(
    props.externalDescribeIcon,
    state,
    'name'
  )

  function onFocus() {
    state.focus = true
  }
  function onBlur() {
    state.focus = false
    v$.value.$touch()
    emit('error', { error: v$.value.$error, propName: 'nameHasError' })
  }
  function handleNameInput(e: Event) {
    const element = e.target as HTMLInputElement
    if (props.isEnterprise) element.value = element.value.toUpperCase()
    emit('value', element.value)
    state.name = element.value
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
        <DocumentTextIcon v-if="props.isEnterprise" />
        <UserIcon v-else />
      </span>
      <span
        class="absolute transition-all duration-300 font-semibold"
        :class="classLabelSpan"
        >{{ isEnterprise ? 'Nome ou razão social' : 'Nome completo' }}</span
      >
      <span
        class="block h-6 w-6 absolute right-2 text-gray-400"
        :class="v$.name.$error ? 'text-red-400' : ''"
      >
        <PencilIcon />
      </span>
      <input
        v-model.lazy.trim="state.name"
        autocomplete="nop"
        type="text"
        class="w-full border-gray-400 text-gray-800"
        :class="classInput"
        :required="props.required"
        @focus="onFocus"
        @blur="onBlur"
        @input="handleNameInput"
      />
    </label>
    <span v-if="v$.name.$error">
      <span v-for="(error, index) of v$.name.$errors" :key="index">
        <small class="ml-2 text-red-600">{{ error.$message }}</small>
      </span>
    </span>
  </div>
</template>
