<template>
  <Teleport to="body">
    <Transition name="confirm">
      <div v-if="modelValue" class="confirm-overlay" @click.self="cancel">
        <div class="confirm-dialog" role="alertdialog" aria-modal="true">
          <div class="confirm-dialog__icon">
            <i class="fa fa-download"></i>
          </div>
          <p class="confirm-dialog__message">{{ message }}</p>
          <div class="confirm-dialog__actions">
            <button class="confirm-dialog__btn confirm-dialog__btn--cancel" @click="cancel">
              Cancel
            </button>
            <button class="confirm-dialog__btn confirm-dialog__btn--confirm" @click="confirm">
              Download
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  message?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const cancel = () => {
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('update:modelValue', false)
  emit('confirm')
}
</script>


