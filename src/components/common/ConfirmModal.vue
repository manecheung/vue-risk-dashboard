、<template>
  <Transition name="page-fade">
    <div v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      aria-modal="true" role="alertdialog" aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description" @keydown="handleKeydown">
      <div class="panel w-full max-w-md" ref="modalContentRef">
        <h2 id="confirm-modal-title" class="panel-title">{{ title }}</h2>
        <div class="p-6">
          <div id="confirm-modal-description" class="text-slate-300 leading-relaxed">
            <slot>
              <p>{{ message }}</p>
            </slot>
          </div>
          <div class="flex justify-end space-x-4 mt-6">
            <button ref="cancelButtonRef" @click="$emit('cancel')" class="btn btn-secondary" aria-label="取消操作">
              取消
            </button>
            <button ref="confirmButtonRef" @click="$emit('confirm')" class="btn btn-primary bg-red-600 hover:bg-red-500"
              aria-label="确认操作">
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
});
const emit = defineEmits(['confirm', 'cancel']);

const modalContentRef = ref(null);
const confirmButtonRef = ref(null);

let focusableElements = [];

const getFocusableElements = () => {
  if (modalContentRef.value) {
    focusableElements = Array.from(
      modalContentRef.value.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled'));
  }
};

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    emit('cancel');
  } else if (e.key === 'Tab') {
    e.preventDefault();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const currentIndex = focusableElements.indexOf(document.activeElement);

    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement.focus();
      } else {
        focusableElements[currentIndex - 1]?.focus();
      }
    } else { // Tab
      if (document.activeElement === lastElement) {
        firstElement.focus();
      } else {
        focusableElements[currentIndex + 1]?.focus();
      }
    }
  }
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      getFocusableElements();
      confirmButtonRef.value?.focus();
    });
  }
});
</script>