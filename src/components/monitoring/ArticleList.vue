<template>
  <section class="panel p-0 flex flex-col h-full min-h-0" :aria-labelledby="title.replace(' ', '-').toLowerCase()">
    <h2 :id="title.replace(' ', '-').toLowerCase()"
      class="text-xl font-semibold text-white border-b border-slate-700 pb-4 p-6 flex-shrink-0">{{ title }}</h2>
    <div class="flex-grow overflow-y-auto">
      <EmptyState v-if="!articles || articles.length === 0" title="暂无相关信息" message="请稍后重试或检查您的网络。" />
      <div v-else class="space-y-6 p-6 pt-4">
        <article v-for="article in articles" :key="article.id" @click="$emit('view-detail', article)"
          @keyup.enter="$emit('view-detail', article)" tabindex="0"
          class="flex flex-col md:flex-row items-start p-4 rounded-lg transition-all duration-300 cursor-pointer hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-sky-500">
          <img :src="article.image" :alt="article.title"
            class="w-full md:w-40 h-24 object-cover rounded-md flex-shrink-0"
            loading="lazy"
            onerror="this.onerror=null; this.src='/ImageError.svg';" />
          <div class="ml-0 md:ml-6 mt-4 md:mt-0 flex-grow min-w-0">
            <div class="overflow-x-auto pb-1 custom-scrollbar">
              <h3 class="text-lg font-semibold text-sky-400 transition-colors whitespace-nowrap">{{ article.title }}
              </h3>
            </div>
            <div class="mt-2 flex items-center space-x-6 text-sm text-slate-400">
              <span>来源: {{ article.author }}</span>
              <time :datetime="article.date">{{ article.date }}</time>
            </div>
            <div v-if="article.tags && article.tags.length > 0" class="mt-3 space-x-2">
              <span v-for="tag in article.tags" :key="tag"
                class="inline-block text-xs font-medium px-2 py-1 rounded-full bg-sky-500/10 text-sky-300">{{ tag
                }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import EmptyState from '@/components/common/EmptyState.vue';

defineProps({
  title: String,
  articles: Array
});
defineEmits(['view-detail']);
</script>