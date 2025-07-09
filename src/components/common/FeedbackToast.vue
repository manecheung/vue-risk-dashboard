<template>
  <div class="fixed bottom-4 right-4 z-[100] w-full max-w-sm">
    <Transition name="page-fade">
      <div
        v-if="feedback.message.text"
        :key="feedback.message.id"
        :class="feedbackClass"
        class="rounded-lg p-3 text-sm flex items-center shadow-lg"
        role="alert"
      >
        <component :is="iconComponent" class="h-5 w-5 mr-3 flex-shrink-0" />
        <span class="flex-grow">{{ feedback.message.text }}</span>
        <button @click="feedback.hide()" class="ml-4 text-xl hover:text-white" aria-label="关闭消息">×</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFeedbackStore } from '@/stores/feedbackStore';
import SuccessIcon from './SuccessIcon.vue';
import ErrorIcon from './ErrorIcon.vue';

const feedback = useFeedbackStore();

const feedbackClass = computed(() => {
  return feedback.message.type === 'success'
    ? 'bg-green-500/20 text-green-300 border-l-4 border-green-400'
    : 'bg-red-500/20 text-red-300 border-l-4 border-red-400';
});

const iconComponent = computed(() => {
    return feedback.message.type === 'success' ? SuccessIcon : ErrorIcon;
});
</script>