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
    const { data, error: err } = await getKnowledgeGraph({ companyId, keyword });
    if (err) {
      error.value = err.message;
    } else {
      knowledgeGraph.value = data;
    }
    loading.value = false;
  }

  async function fetchAllDashboardData() {
    loading.value = true;
    error.value = null;
    try {
      const [
        metricsRes,
        distributionRes,
        healthRes,
        supplyChainRes,
        analysisRes,
        mapRes,
        graphRes // 2. 初始加载时就带上默认搜索参数
      ] = await Promise.all([
        getKeyMetrics(),
        getRiskDistribution(),
        getIndustryHealth(),
        getSupplyChainRisk(),
        fetchRiskAnalysis({ page: 1, pageSize: 50 }),
        getRiskMap(),
        getKnowledgeGraph({ keyword: graphOptions.value.searchTerm }) 
      ]);

      // ... (处理其他数据的代码保持不变)
      if (metricsRes.error) throw new Error(`Failed to fetch key metrics: ${metricsRes.error.message}`);
      keyMetrics.value = metricsRes.data;

      if (distributionRes.error) throw new Error(`Failed to fetch risk distribution: ${distributionRes.error.message}`);
      riskDistribution.value = distributionRes.data;

      if (healthRes.error) throw new Error(`Failed to fetch industry health: ${healthRes.error.message}`);
      industryHealth.value = healthRes.data;

      if (supplyChainRes.error) throw new Error(`Failed to fetch supply chain risk: ${supplyChainRes.error.message}`);
      supplyChainRisk.value = supplyChainRes.data;

      if (analysisRes.error) throw new Error(`Failed to fetch risk analysis: ${analysisRes.error.message}`);
      riskAnalysis.value = analysisRes.data;

      if (mapRes.error) throw new Error(`Failed to fetch risk map: ${mapRes.error.message}`);
      riskMap.value = mapRes.data;
      
      if (graphRes.error) throw new Error(`Failed to fetch knowledge graph: ${graphRes.error.message}`);
      knowledgeGraph.value = graphRes.data;

    } catch (e) {
      error.value = e.message;
      console.error("Error fetching dashboard data:", e);
    } finally {
      loading.value = false;
    }
  }

  async function getRiskAnalysis(page = 1, pageSize = 10) {
    loading.value = true;
    const { data, error: err } = await fetchRiskAnalysis({ page, pageSize });
    if (err) {
      error.value = err.message;
    } else {
      riskAnalysis.value = data;
    }
    loading.value = false;
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
  };
});
