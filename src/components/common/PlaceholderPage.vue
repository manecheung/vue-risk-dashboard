<template>
  <div class="h-full flex items-center justify-center" style="min-height: calc(100vh - 4rem);">
    <div class="text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2.25 2.25 0 003.072 0l-2.25-2.25a2.25 2.25 0 00-3.072 0l2.25 2.25zM15.428 19.428a2.25 2.25 0 000-3.072l-2.25 2.25a2.25 2.25 0 000 3.072zM15.428 4.572a2.25 2.25 0 000 3.072l-2.25-2.25a2.25 2.25 0 000-3.072zM4.572 15.428a2.25 2.25 0 003.072 0l-2.25-2.25a2.25 2.25 0 00-3.072 0l2.25 2.25z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
      </svg>
      <h1 class="mt-6 text-4xl font-bold text-slate-500">{{ pageTitle }}</h1>
      <p class="mt-4 text-slate-400">该页面正在建设中，敬请期待...</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pageTitle: {
    type: String,
    default: '页面建设中'
  }
});
</script>
