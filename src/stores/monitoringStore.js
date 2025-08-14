import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getMonitoringArticles, getArticleDetail } from '@/services/api';
import { useFeedbackStore } from './feedbackStore';

export const useMonitoringStore = defineStore('monitoring', () => {
  const articles = ref([]);
  const pagination = ref({
    page: 1,
    pageSize: 5,
    totalRecords: 0,
    totalPages: 1,
  });
  const filters = ref({
    type: 'all', // 'all', 'news', 'risk'
    keyword: '',
  });
  const currentArticle = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const feedback = useFeedbackStore();

  const pageSizeOptions = ref([5, 10, 20, 50]);

  function setPageSize(size) {
    pagination.value.pageSize = size;
    fetchArticles(1);
  }

  async function fetchArticles(page = 1) {
    isLoading.value = true;
    error.value = null;
    try {
      const params = {
        page: page,
        pageSize: pagination.value.pageSize,
      };
      if (filters.value.keyword) {
        params.keyword = filters.value.keyword;
      }
      if (filters.value.type && filters.value.type !== 'all') {
        params.type = filters.value.type;
      }
      const data = await getMonitoringArticles(params);
      if (data && data.records) {
        articles.value = data.records;
        pagination.value = {
          page: data.page,
          pageSize: data.pageSize,
          totalRecords: data.totalRecords,
          totalPages: data.totalPages,
        };
      } else {
        articles.value = [];
        // Reset pagination if no data
        pagination.value = { page: 1, pageSize: 5, totalRecords: 0, totalPages: 1 };
      }
    } catch (err) {
      error.value = err.message;
      feedback.show(`无法加载资讯列表: ${err.message}`, 'error');
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchArticleDetail(id) {
    isLoading.value = true;
    error.value = null;
    currentArticle.value = null;
    try {
      const data = await getArticleDetail(id);
      currentArticle.value = data;
    } catch (err) {
      error.value = err.message;
      feedback.show(`无法加载资讯详情: ${err.message}`, 'error');
    } finally {
      isLoading.value = false;
    }
  }

  function applyFilters() {
    fetchArticles(1); // Reset to first page when filters change
  }
  
  function setPage(page) {
    if (page > 0 && page <= pagination.value.totalPages) {
      fetchArticles(page);
    }
  }


  function reset() {
    articles.value = [];
    pagination.value = {
      page: 1,
      pageSize: 5,
      totalRecords: 0,
      totalPages: 1,
    };
    filters.value = {
      type: 'all',
      keyword: '',
    };
    currentArticle.value = null;
    isLoading.value = false;
    error.value = null;
  }

  return {
    articles,
    pagination,
    filters,
    currentArticle,
    isLoading,
    error,
    fetchArticles,
    fetchArticleDetail,
    applyFilters,
    setPage,
    setPageSize,
    pageSizeOptions,
    reset,
  };
});
