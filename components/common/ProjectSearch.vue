<template>
  <div class="project-search">
    <i class="fa fa-magnifying-glass project-search__icon" aria-hidden="true" />
    <input
      ref="inputRef"
      v-model="model"
      class="project-search__input"
      type="text"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
    />
    <button
      v-if="model"
      class="project-search__clear"
      type="button"
      :aria-label="clearAriaLabel"
      @click="handleClear"
    >
      <i class="fa fa-xmark" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    placeholder?: string
    ariaLabel?: string
  }>(),
  {
    placeholder: 'Search by name, tech, or keyword...',
    ariaLabel: 'Search projects',
  },
)

defineOptions({ name: 'ProjectSearch' })

const clearAriaLabel = 'Clear search'
const inputRef = ref<HTMLInputElement | null>(null)

const handleClear = () => {
  model.value = ''
  inputRef.value?.focus()
}
</script>
