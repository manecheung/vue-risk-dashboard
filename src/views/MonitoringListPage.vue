<template>
  <main class="flex flex-col p-6" style="height: calc(100vh - 4rem);">
    <header class="flex-shrink-0 mb-4">
      <h1 class="text-2xl font-bold text-white">监测信息总览</h1>
      <p class="text-sm text-slate-400 mt-1">查看最新的行业新闻和风险预警</p>
    </header>

    <!-- 筛选区域 -->
    <div class="flex-shrink-0 mb-6 p-4 bg-slate-800/50 rounded-lg flex flex-wrap items-center gap-4">
      <div class="flex items-center space-x-2">
        <label for="type-filter" class="text-slate-300">类型:</label>
        <div class="w-32">
          <CustomSelect id="type-filter" v-model="store.filters.type" :options="typeOptions" />
        </div>
      </div>
      <div class="flex items-center space-x-2 flex-grow">
        <label for="keyword-search" class="text-slate-300 flex-shrink-0">关键词:</label>
        <input type="search" id="keyword-search" v-model.lazy="store.filters.keyword" @keyup.enter="store.applyFilters" placeholder="搜索标题或标签..." class="form-input flex-grow text-sm">
      </div>
      <button @click="store.applyFilters" class="btn btn-primary text-sm">
        搜索
      </button>
    </div>

    <!-- 加载与错误状态 -->
    <div v-if="store.isLoading" class="text-center py-10">
      <p class="text-slate-400">正在加载中...</p>
    </div>
    <div v-else-if="store.error" class="text-center py-10">
      <p class="text-red-400">加载失败: {{ store.error }}</p>
    </div>

    <!-- 内容区域 -->
    <div v-else class="flex-grow grid grid-cols-1 gap-6 min-h-0">
      <ArticleList 
        title="监测资讯列表" 
        :articles="store.articles" 
        @view-detail="navigateToDetail" 
      />
    </div>
    
    <!-- 分页区域 -->
    <footer v-if="!store.isLoading && store.pagination.totalPages > 1" class="flex-shrink-0 flex justify-between items-center p-3 mt-4 border-t border-slate-700 text-sm text-slate-400">
        <div>共 {{ store.pagination.totalRecords }} 条</div>
        <nav class="flex items-center space-x-4" aria-label="分页">
          <div class="flex items-center space-x-2">
            <label for="pageSize" class="text-xs">每页</label>
            <div class="w-20">
              <CustomSelect id="pageSize" :model-value="store.pagination.pageSize" @update:modelValue="store.setPageSize($event)" :options="store.pageSizeOptions.map(s => ({value: s, label: s}))" direction="up" />
            </div>
          </div>
          <button @click="store.setPage(store.pagination.page - 1)" :disabled="store.pagination.page <= 1" class="btn btn-secondary text-xs px-3 py-1" aria-label="上一页">上一页</button>
          <span>{{ store.pagination.page }} / {{ store.pagination.totalPages }}</span>
          <button @click="store.setPage(store.pagination.page + 1)" :disabled="store.pagination.page >= store.pagination.totalPages" class="btn btn-secondary text-xs px-3 py-1" aria-label="下一页">下一页</button>
        </nav>
      </footer>
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMonitoringStore } from '@/stores/monitoringStore';
import { useFeedbackStore } from '@/stores/feedbackStore';
import ArticleList from '@/components/monitoring/ArticleList.vue';
import CustomSelect from '@/components/common/CustomSelect.vue';

const store = useMonitoringStore();
const router = useRouter();
const feedback = useFeedbackStore();

const typeOptions = [
  { value: 'all', label: '全部' },
  { value: 'news', label: '行业新闻' },
  { value: 'risk', label: '风险预警' },
];

onMounted(() => {
  // 如果当前没有文章，则获取
  if (store.articles.length === 0) {
    store.fetchArticles();
  }
});

const navigateToDetail = (article) => {
  const routeName = article.type === 'news' ? 'newsDetail' : 'riskDetail';
  router.push({ name: routeName, params: { id: article.id } })
    .catch(err => {
      console.error("路由导航错误:", err);
      feedback.show('页面跳转失败，请稍后重试。', 'error');
    });
};
</script>
