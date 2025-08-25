<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center h-32 bg-slate-800 rounded-md">
      <p class="text-slate-500">加载图片中...</p>
    </div>
    <div v-else-if="error" class="flex items-center justify-center h-32 bg-red-900/50 rounded-md">
      <p class="text-red-400">图片加载失败</p>
    </div>
    <img v-else :src="objectUrl" :alt="alt" class="w-full h-auto rounded-md">
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import api from '@/services/api'; // Import the raw axios instance

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Authenticated Image'
  }
});

const objectUrl = ref(null);
const loading = ref(false);
const error = ref(false);

let currentObjectUrl = null;

const fetchImage = async () => {
  if (!props.src) return;

  loading.value = true;
  error.value = false;

  // Revoke the previous object URL if it exists
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }

  try {
    console.log('Fetching image from:', props.src);
    const response = await api.get(props.src, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    currentObjectUrl = URL.createObjectURL(blob);
    objectUrl.value = currentObjectUrl;
    console.log('Image loaded successfully:', objectUrl.value);
  } catch (e) {
    console.error('Failed to load authenticated image:', e);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

watch(() => props.src, fetchImage, { immediate: true });

onUnmounted(() => {
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
  }
});
</script>
