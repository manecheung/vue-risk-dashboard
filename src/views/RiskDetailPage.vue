<template>
  <main class="flex flex-col p-6" style="height: calc(100vh - 4rem);">
    <nav class="flex-shrink-0 mb-6 text-sm text-slate-400" aria-label="面包屑导航">
      <router-link to="/monitoring" class="hover:text-sky-400" aria-label="返回网络信息监测列表">网络信息监测</router-link> / 风险详情
    </nav>
    <div v-if="article" class="flex-grow flex flex-col lg:flex-row gap-6 items-stretch min-h-0">
      <aside class="w-full lg:w-1/4 flex-shrink-0 space-y-6">
        <div class="panel p-4">
          <h3 class="font-semibold text-sky-400">风险源</h3>
          <p class="mt-2 text-sm text-slate-300">{{ article.riskSource }}</p>
        </div>
        <div class="panel p-4">
          <h3 class="font-semibold text-sky-400">相关公司</h3>
          <p class="mt-2 text-sm text-sky-400 cursor-pointer hover:underline">{{ article.relatedCompany }}</p>
        </div>
        <div class="panel p-4">
          <h3 class="font-semibold text-sky-400">相关产品</h3>
          <p class="mt-2 text-sm text-slate-300">{{ article.relatedProduct }}</p>
        </div>
      </aside>
      <article class="w-full lg:w-3/4 panel flex flex-col">
        <header class="p-8 pb-4 flex-shrink-0">
          <h1 class="text-2xl font-bold text-white">{{ article.title }}</h1>
          <div class="my-4 text-sm text-slate-400 space-x-4 border-b border-slate-700 pb-4">
            <span>来源: {{ article.author }}</span><time :datetime="article.date">发布日期: {{ article.date }}</time>
          </div>
        </header>
        <div class="flex-grow overflow-y-auto px-8 pb-8">
          <div class="flex flex-col md:flex-row gap-8 items-start">
            <div class="text-slate-300 leading-relaxed flex-grow prose prose-invert max-w-none"
              v-html="sanitizedNotice"></div>
            <img :src="article.image.replace('160x90', '400x225')" :alt="article.title"
              class="w-full md:w-2/5 h-auto object-cover rounded-md flex-shrink-0"
              onerror="this.onerror=null;this.src='/ImageError.svg';" />
          </div>
        </div>
      </article>
    </div>
    <div v-else class="flex items-center justify-center h-full">
      <p class="text-slate-500">风险信息加载中或未找到...</p>
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

const sanitizedNotice = computed(() => {
  if (article.value && article.value.notice) {
    return DOMPurify.sanitize(article.value.notice, { USE_PROFILES: { html: true } });
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