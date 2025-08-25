import { defineStore } from 'pinia';
import { getUestcTrainedModels, getUestcTrainingPlots } from '@/services/api';
import { useFeedbackStore } from './feedbackStore';

export const useModelManagementStore = defineStore('modelManagement', {
  state: () => ({
    models: [],
    pagination: {
      total: 0,
      current: 1,
      pages: 1,
      size: 10,
    },
    sort: {
      key: 'createTime', // default sort key
      direction: 'desc', // default sort direction
    },
    filters: {
      status: 'All',
    },
    loading: false,
    selectedModelPlots: [],
    plotsLoading: false,
  }),
  actions: {
    async fetchModels() {
      this.loading = true;
      const feedback = useFeedbackStore();
      try {
        // 后端API只接受current和size参数
        const params = {
          current: this.pagination.current,
          size: this.pagination.size,
        };

        const pageData = await getUestcTrainedModels(params);
        this.models = pageData.records;
        this.pagination.total = pageData.total;
        this.pagination.current = pageData.current;
        this.pagination.pages = pageData.pages;
        this.pagination.size = pageData.size;
      } catch (error) {
        feedback.show('获取模型列表失败', 'error');
        console.error('获取模型列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchTrainingPlots(modelId) {
      this.plotsLoading = true;
      this.selectedModelPlots = [];
      const feedback = useFeedbackStore();
      try {
        const plots = await getUestcTrainingPlots(modelId);
        this.selectedModelPlots = plots;
      } catch (error) {
        feedback.show('获取训练图表失败', 'error');
        console.error('获取训练图表失败:', error);
      } finally {
        this.plotsLoading = false;
      }
    },

    setPage(page) {
      this.pagination.current = page;
      this.fetchModels();
    },

    setPageSize(size) {
      this.pagination.current = 1; // Reset to first page
      this.pagination.size = size;
      this.fetchModels();
    },

    setSort(key) {
      if (this.sort.key === key) {
        this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        this.sort.key = key;
        this.sort.direction = 'asc';
      }
      this.pagination.current = 1; // Reset to first page
      this.fetchModels();
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
      this.pagination.current = 1; // Reset to first page
      this.fetchModels();
    },
  },
});
