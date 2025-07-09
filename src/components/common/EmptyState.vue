<template>
  <div class="flex flex-col items-center justify-center text-center p-8 h-full text-slate-500">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
      stroke-width="1">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.22-7.11a.75.75 0 00-1.39.44l1.6 5.12-3.17-3.17a.75.75 0 00-1.06 0l-3.95 3.95-3.53-3.53a.75.75 0 00-1.06 0l-4.13 4.13a.75.75 0 000 1.06l1.87 1.87a.75.75 0 001.06 0l3.06-3.06 3.95 3.95a.75.75 0 001.06 0l3.17-3.17 1.6 5.12a.75.75 0 001.4-.44v-.228zM5.25 21a.75.75 0 00.75-.75v-2.5a.75.75 0 00-1.5 0v2.5a.75.75 0 00.75.75zM9 21a.75.75 0 00.75-.75v-4.5a.75.75 0 00-1.5 0v4.5a.75.75 0 00.75.75zM12.75 21a.75.75 0 00.75-.75v-7.5a.75.75 0 00-1.5 0v7.5a.75.75 0 00.75.75zM16.5 21a.75.75 0 00.75-.75v-1.5a.75.75 0 00-1.5 0v1.5a.75.75 0 00.75.75z" />
    </svg>
    <h4 class="text-lg font-semibold text-slate-400">{{ title }}</h4>
    <p class="mt-2 text-sm max-w-sm">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '暂无数据'
  },
  message: {
    type: String,
    default: '请尝试调整筛选条件或添加新条目。'
  }
});
</script>