<template>
  <main class="flex flex-col p-6" style="height: calc(100vh - 4rem);">
    <nav class="flex-shrink-0 mb-6 text-sm text-slate-400" aria-label="面包屑导航">
      <router-link to="/monitoring" class="hover:text-sky-400" aria-label="返回网络信息监测列表">网络信息监测</router-link> / 要闻详情
    </nav>
    <article v-if="article" class="panel flex-grow min-h-0 flex flex-col">
      <header class="p-8 md:p-12 pb-4 flex-shrink-0">
        <h1 class="text-3xl font-bold text-center text-white">{{ article.title }}</h1>
        <div class="text-center my-6 text-sm text-slate-400 space-x-6">
          <span class="pr-6 border-r border-slate-700">来源: {{ article.author }}</span>
          <time :datetime="article.date">发布日期: {{ article.date }}</time>
        </div>
      </header>
      <div class="flex-grow overflow-y-auto px-8 md:px-12 pb-8">
        <div class="text-slate-300 leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none" v-html="sanitizedContent"></div>
      </div>
    </article>
    <div v-else class="flex items-center justify-center h-full">
      <p class="text-slate-500">文章加载中或未找到...</p>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMonitoringStore } from '@/stores/monitoringStore';
import DOMPurify from 'dompurify';

const route = useRoute();
const store = useMonitoringStore();

// Use a computed property to reactively get the article from the store
const article = computed(() => store.currentArticle);

const sanitizedContent = computed(() => {
  if (article.value && article.value.content) {
    // Allow more tags for better formatting, like tables
    return DOMPurify.sanitize(article.value.content, { 
      USE_PROFILES: { html: true },
      ADD_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td'],
      ADD_ATTR: ['colspan', 'rowspan', 'cellspacing', 'cellpadding', 'border']
    });
  }
  return '';
});

onMounted(() => {
  const articleId = parseInt(route.params.id);
  if (articleId) {
    store.fetchArticleDetail(articleId);
  }
});

// Clear the current article when the component is unmounted
onUnmounted(() => {
  store.currentArticle = null;
});
</script>