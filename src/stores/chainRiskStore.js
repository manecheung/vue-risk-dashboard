import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useFeedbackStore } from './feedbackStore';
import { getSimulations, saveSimulation, deleteSimulation, runSimulation, runNewSimulation, getAllCompanies } from '@/services/api';

export const useChainRiskStore = defineStore('chainRisk', () => {
  const feedback = useFeedbackStore();

  // --- State ---
  const simulations = ref([]);
  const allCompanies = ref([]);
  const pagination = ref({
    page: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const isLoading = ref(false); // For the list
  const isGraphLoading = ref(false); // For the graph panel
  const error = ref(null);

  // Holds the graph data for the main visualization component
  const currentGraph = ref(null); 

  // --- Actions ---

  async function fetchAllCompanies() {
    try {
      const companies = await getAllCompanies();
      allCompanies.value = companies.map(c => ({ id: c.id.toString(), label: c.name }));
    } catch (err) {
      feedback.show(`无法加载公司列表: ${err.message}`, 'error');
    }
  }

  async function runLiveSimulation(startNodeName) {
    isGraphLoading.value = true;
    currentGraph.value = null;
    try {
      const result = await runNewSimulation(startNodeName);
      currentGraph.value = {
        simulationName: `实时模拟 - ${startNodeName || '未知起点'}`,
        ...result
      };
      feedback.show('实时风险蔓延模拟成功', 'success');
    } catch (err) {
      feedback.show(`模拟运行失败: ${err.message}`, 'error');
    } finally {
      isGraphLoading.value = false;
    }
  }

  async function fetchSimulations(page = 1, keyword = '') {
    isLoading.value = true;
    error.value = null;
    try {
      const params = { page, pageSize: pagination.value.pageSize, keyword };
      const data = await getSimulations(params);
      simulations.value = data.records;
      pagination.value = {
        page: data.page,
        pageSize: data.pageSize,
        totalRecords: data.totalRecords,
        totalPages: data.totalPages,
      };
    } catch (err) {
      error.value = err.message;
      feedback.show(`无法加载模拟列表: ${err.message}`, 'error');
    }
    finally {
      isLoading.value = false;
    }
  }

  async function removeSimulation(id) {
    try {
      await deleteSimulation(id);
      feedback.show('模拟场景删除成功', 'success');
      fetchSimulations(pagination.value.page);
      if (currentGraph.value && currentGraph.value.simulationId === id) {
        currentGraph.value = null;
      }
    } catch (err) {
      feedback.show(`删除失败: ${err.message}`, 'error');
    }
  }

  async function createSimulation(simulationData) {
    try {
      const response = await saveSimulation(simulationData);
      feedback.show('新模拟场景已保存', 'success');
      fetchSimulations(1);
      return response;
    } catch (err) {
      feedback.show(`保存失败: ${err.message}`, 'error');
      throw err;
    }
  }

  async function startSimulation(id, startNodeId) {
    isGraphLoading.value = true;
    try {
      const result = await runSimulation(id, startNodeId);
      currentGraph.value = result;
      feedback.show(`模拟 #${id} 运行成功`, 'success');
    } catch (err) {
      feedback.show(`模拟运行失败: ${err.message}`, 'error');
    }
    finally {
      isGraphLoading.value = false;
    }
  }

  // --- Helpers ---

  function loadSimulationGraph(simulation) {
    feedback.show(`正在加载模拟场景 #${simulation.id}...`, 'info');
    try {
      const nodes = JSON.parse(simulation.nodes);
      const edges = JSON.parse(simulation.edges);
      const riskPath = simulation.riskPath ? JSON.parse(simulation.riskPath) : [];
      
      currentGraph.value = {
        simulationId: simulation.id,
        simulationName: simulation.name,
        nodes,
        edges,
        riskPath
      };
      feedback.show('图谱数据已加载!', 'success');
    } catch (err) {
      feedback.show(`加载图谱失败: ${err.message}`, 'error');
      currentGraph.value = null;
    }
  }

  return {
    simulations,
    allCompanies,
    pagination,
    isLoading,
    isGraphLoading, // Expose new state
    error,
    currentGraph,
    fetchSimulations,
    fetchAllCompanies,
    runLiveSimulation,
    removeSimulation,
    createSimulation,
    startSimulation,
    loadSimulationGraph,
  };
});
