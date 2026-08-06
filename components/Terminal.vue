<template>
  <Teleport to="body">
    <Transition name="terminal-fade">
      <div v-if="visible" class="terminal-overlay" @click.self="close">
        <div class="terminal" @click.stop>
          <div class="terminal__header">
            <span class="terminal__title">portfolio-terminal</span>
            <span class="terminal__hint">esc to close · ctrl+k to toggle</span>
            <button class="terminal__btn" @click="close" aria-label="Close terminal">&times;</button>
          </div>
          <div class="terminal__body" ref="bodyRef">
            <div class="terminal__output">
              <div
                v-for="(line, i) in lines"
                :key="i"
                class="terminal__line"
                :class="`terminal__line--${line.type}`"
              >{{ line.text }}</div>
            </div>
            <div v-if="visible" class="terminal__prompt-line">
              <span class="terminal__prompt">{{ getPrompt() }}</span>
              <input
                ref="inputRef"
                v-model="currentInput"
                class="terminal__input"
                type="text"
                spellcheck="false"
                autocomplete="off"
                autocapitalize="off"
                :disabled="isStreaming"
                @keydown="onKeydown"
              />
              <span v-if="isStreaming" class="terminal__cursor" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { visible, lines, currentInput, isStreaming, close, submit, navigateHistory, aiAvailable, checkStatus, getPrompt, tabComplete } = useTerminal()

const bodyRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    submit()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    navigateHistory('up')
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    navigateHistory('down')
  } else if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    close()
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
    e.preventDefault()
    currentInput.value = ''
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
    e.preventDefault()
    close()
  } else if (e.key === 'Tab') {
    e.preventDefault()
    tabComplete()
  }
}

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    if (visible.value) {
      close()
    } else if (aiAvailable.value) {
      const term = useTerminal()
      term.open()
    }
  }
}

onMounted(() => {
  checkStatus()
  window.addEventListener('keydown', onGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>
