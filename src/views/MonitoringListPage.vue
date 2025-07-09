<template>
  <main class="flex flex-col p-6" style="height: calc(100vh - 4rem);">
    <header class="flex-shrink-0 mb-6 text-sm text-slate-400" aria-label="面包屑导航">网络信息监测 / 监测信息总览</header>
    <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
      <ArticleList title="要闻推荐" :articles="store.topNews" @view-detail="navigateToDetail('newsDetail', $event)" />
      <ArticleList title="风险概览" :articles="store.riskNews" @view-detail="navigateToDetail('riskDetail', $event)" />
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useMonitoringStore } from '@/stores/monitoringStore';
import { useFeedbackStore } from '@/stores/feedbackStore';
import ArticleList from '@/components/monitoring/ArticleList.vue';

const store = useMonitoringStore();
const router = useRouter();
const feedback = useFeedbackStore();

const navigateToDetail = (routeName, article) => {
  router.push({ name: routeName, params: { id: article.id } })
    .catch(err => {
      console.error("路由导航错误:", err);
      feedback.show('页面跳转失败，请稍后重试。', 'error');
    });
};
</script>