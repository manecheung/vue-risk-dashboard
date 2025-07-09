import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getDashboardData } from '@/services/api';
import { useFeedbackStore } from './feedbackStore';

export const useDashboardStore = defineStore('dashboard', () => {
  const feedback = useFeedbackStore();
  const isLoading = ref(true);
  const error = ref(null);

  const dashboardData = ref({
    keyMetrics: [],
    riskDistribution: [],
    riskAnalysis: [],
    industryHealth: { categories: [], values: [] },
    supplyChainRisk: { indicator: [], data: [] },
    knowledgeGraph: { nodes: [], edges: [] },
    mapData: []
  });
  const activeView = ref('graph');
  const graphOptions = ref({
    layout: 'force',
    filters: { supplier: true, customer: true, partner: true },
    searchTerm: ''
  });
  const layoutOptions = ref([
    { value: 'force', label: '力导向' },
    { value: 'radial', label: '辐射状' }
  ]);

  function setActiveView(view) {
    activeView.value = view;
  }

  function resetGraphOptions() {
    graphOptions.value.searchTerm = '';
    graphOptions.value.filters = { supplier: true, customer: true, partner: true };
  }

  async function fetchData() {
    isLoading.value = true;
    error.value = null;
    const { data, error: apiError } = await getDashboardData();
    if (apiError) {
        error.value = apiError;
        feedback.show('仪表盘数据加载失败，请稍后重试。', 'error');
    } else {
        dashboardData.value = data;
    }
    isLoading.value = false;
  }

  fetchData();

  return {
    dashboardData,
    activeView,
    graphOptions,
    layoutOptions,
    isLoading,
    error,
    setActiveView,
    resetGraphOptions,
    fetchData,
  };
});
