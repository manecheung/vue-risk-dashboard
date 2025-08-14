import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  getKeyMetrics, 
  getRiskDistribution, 
  getIndustryHealth, 
  getSupplyChainRisk, 
  getRiskAnalysis as fetchRiskAnalysis, 
  getRiskMap,
  getKnowledgeGraph
} from '@/services/api';

export const useDashboardStore = defineStore('dashboard', () => {
  // State for data from API
  const keyMetrics = ref([]);
  const riskDistribution = ref([]);
  const industryHealth = ref({ categories: [], values: [] });
  const supplyChainRisk = ref({ indicator: [], data: [] });
  const riskAnalysis = ref({
    records: [],
    page: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const riskMap = ref([]);
  const knowledgeGraph = ref({ nodes: [], edges: [] });
  const loading = ref(false);
  const error = ref(null);

  // State for UI controls
  const activeView = ref('graph');
  const graphOptions = ref({
    layout: 'force',
    filters: {
      supplier: true,
      customer: true,
      partner: true,
    },
    searchTerm: '东方电气', // 1. 设置默认搜索词
  });
  const layoutOptions = ref([
    { value: 'force', label: '力导向' },
    { value: 'grid', label: '网格' },
    { value: 'circular', label: '环形' },
  ]);

  // Actions
  function setActiveView(view) {
    activeView.value = view;
  }

  function resetGraphOptions() {
    graphOptions.value = {
      layout: 'force',
      filters: {
        supplier: true,
        customer: true,
        partner: true,
      },
      searchTerm: '东方电气', // 重置时也使用默认值
    };
    // 重置后立即获取默认图谱
    fetchGraphData({ keyword: graphOptions.value.searchTerm });
  }

  // 3. 新增一个action，用于根据ID或关键词获取图谱
  async function fetchGraphData({ companyId = null, keyword = null } = {}) {
    loading.value = true;
    error.value = null;
    try {
      const data = await getKnowledgeGraph({ companyId, keyword });
      knowledgeGraph.value = data || { nodes: [], edges: [] };
    } catch (err) {
      error.value = err.message;
      knowledgeGraph.value = { nodes: [], edges: [] }; // 在出错时也提供一个空状态
    } finally {
      loading.value = false;
    }
  }

  async function fetchAllDashboardData() {
    loading.value = true;
    error.value = null;
    try {
      const [
        metricsData,
        distributionData,
        healthData,
        supplyChainData,
        analysisData,
        mapData,
        graphData
      ] = await Promise.all([
        getKeyMetrics(),
        getRiskDistribution(),
        getIndustryHealth(),
        getSupplyChainRisk(),
        fetchRiskAnalysis({ page: 1, pageSize: 50 }),
        getRiskMap(),
        getKnowledgeGraph({ keyword: graphOptions.value.searchTerm })
      ]);

      keyMetrics.value = metricsData || [];
      riskDistribution.value = distributionData || [];
      industryHealth.value = healthData || { categories: [], values: [] };
      supplyChainRisk.value = supplyChainData || { indicator: [], data: [] };
      riskAnalysis.value = analysisData || { records: [] };
      riskMap.value = mapData || [];
      knowledgeGraph.value = graphData || { nodes: [], edges: [] };

    } catch (e) {
      error.value = e.message;
      console.error("Error fetching dashboard data:", e);
      // 在捕获到错误时，将所有数据状态重置为空，避免页面因旧数据或undefined而出错
      keyMetrics.value = [];
      riskDistribution.value = [];
      industryHealth.value = { categories: [], values: [] };
      supplyChainRisk.value = { indicator: [], data: [] };
      riskAnalysis.value = { records: [] };
      riskMap.value = [];
      knowledgeGraph.value = { nodes: [], edges: [] };
    } finally {
      loading.value = false;
    }
  }

  async function getRiskAnalysis(page = 1, pageSize = 10) {
    loading.value = true;
    const { data, error: err } = await fetchRiskAnalysis({ page, pageSize });
    if (err) {
      error.value = err.message;
    } else if (data) {
      riskAnalysis.value = data;
    }
    loading.value = false;
  }

  function reset() {
    keyMetrics.value = [];
    riskDistribution.value = [];
    industryHealth.value = { categories: [], values: [] };
    supplyChainRisk.value = { indicator: [], data: [] };
    riskAnalysis.value = {
      records: [],
      page: 1,
      pageSize: 10,
      totalRecords: 0,
      totalPages: 1,
    };
    riskMap.value = [];
    knowledgeGraph.value = { nodes: [], edges: [] };
    loading.value = false;
    error.value = null;
    activeView.value = 'graph';
    graphOptions.value = {
      layout: 'force',
      filters: {
        supplier: true,
        customer: true,
        partner: true,
      },
      searchTerm: '东方电气',
    };
  }

  return {
    // Data state
    keyMetrics,
    riskDistribution,
    industryHealth,
    supplyChainRisk,
    riskAnalysis,
    riskMap,
    knowledgeGraph,
    loading,
    error,
    // UI state
    activeView,
    graphOptions,
    layoutOptions,
    // Actions
    setActiveView,
    resetGraphOptions,
    fetchAllDashboardData,
    getRiskAnalysis,
    fetchGraphData, // 暴露新方法
    reset, // 暴露 reset 方法
  };
});
