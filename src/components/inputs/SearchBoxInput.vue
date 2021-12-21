<script setup lang="ts">
  import { reactive, defineEmits, defineProps } from 'vue'
  import { SearchIcon, XIcon } from '@heroicons/vue/outline'

  const emit = defineEmits(['value'])

  const props = defineProps({
    externalDescribeIcon: {
      type: Boolean,
      default: true
    }
  })

  const state = reactive({
    input_value: ''
  })

  function clearInput() {
    state.input_value = ''
    emit('value', '')
  }
</script>

<template>
  <div>
    <label
      class="relative flex w-full"
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
        <SearchIcon />
      </span>
      <span class="block h-6 w-6 absolute right-2 text-gray-400">
        <XIcon
          v-if="state.input_value.length > 0"
          class="cursor-pointer animate-animated animate-zoomIn animate-faster"
          @click="clearInput"
        />
        <SearchIcon
          v-else
          class="animate-animated animate-zoomIn animate-faster"
        />
      </span>
      <input
        v-model="state.input_value"
        type="text"
        autocomplete="nop"
        placeholder="Digite para filtrar..."
        class="w-full border-gray-400 text-gray-800"
        :class="props.externalDescribeIcon ? 'rounded-r-md' : 'rounded-md'"
        @keyup="() => emit('value', state.input_value)"
      />
    </label>
  </div>
</template>
