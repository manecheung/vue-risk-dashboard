import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFeedbackStore = defineStore('feedback', () => {
  const message = ref({ text: '', type: 'success', id: 0 });
  let timeoutId = null;

  function show(text, type = 'success', duration = 4000) {
    clearTimeout(timeoutId);
    message.value = { text, type, id: Date.now() };

    timeoutId = setTimeout(() => {
      hide();
    }, duration);
  }

  function hide() {
    message.value = { text: '', type: 'success', id: 0 };
  }

  return { message, show, hide };
});