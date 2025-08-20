import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  getAllSimulations,
  getSimulationTopology,
  getSimulationStepData,
  getSimulationCompanyDetails,
  createSimulation as createSimulationApi,
  deleteSimulation as deleteSimulationApi,
} from '@/services/api';

export const useSimulationStore = defineStore('simulation', () => {
  // --- State ---
  const simulations = ref([]);
  const selectedSimulationId = ref(null);
  const topology = ref(null);
  const stepDataCache = ref({});
  const currentStepData = ref(null);
  const selectedNodeDetails = ref(null);
  const selectedNodeId = ref(null);
  const currentTime = ref(0); // Centralized state for current time

  const isLoading = ref(false);
  const isLoadingDetails = ref(false);
  const error = ref(null);
  const isAnimating = ref(false); // 动画状态锁

  // --- Getters ---
  const simulationOptions = computed(() =>
    simulations.value.map(s => ({
      value: s.id,
      label: s.name,
    }))
  );

  const timeRange = computed(() => topology.value?.timeRange || { min: 0, max: 0 });

  const graphData = computed(() => {
    if (!topology.value) return null;
    return {
      nodes: topology.value.nodes.map(n => ({ id: n.id, name: n.name })),
      edges: topology.value.edges,
    };
  });

  const nodeUpdates = computed(() => {
    if (!currentStepData.value) return [];
    return currentStepData.value.nodesState;
  });

  // --- Actions ---
  function setAnimating(status) {
    isAnimating.value = status;
  }

  async function fetchSimulations() {
    isLoading.value = true;
    error.value = null;
    try {
      simulations.value = await getAllSimulations();
      if (simulations.value.length > 0) {
        await selectSimulation(simulations.value[0].id);
      }
    } catch (e) {
      error.value = e.message;
      console.error('Failed to fetch simulations:', e);
    } finally {
      isLoading.value = false;
    }
  }

  async function selectSimulation(id) {
    if (!id || selectedSimulationId.value === id) return;

    isLoading.value = true;
    error.value = null;
    selectedSimulationId.value = id;
    stepDataCache.value = {};
    selectedNodeId.value = null;
    selectedNodeDetails.value = null;

    try {
      topology.value = await getSimulationTopology(id);
      if (topology.value && topology.value.timeRange) {
        // Set current time and fetch initial step data
        await setCurrentTime(topology.value.timeRange.min);
      }
    } catch (e) {
      error.value = e.message;
      topology.value = null;
      console.error(`Failed to select simulation ${id}:`, e);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchStepData(time) {
    if (!selectedSimulationId.value) return;

    if (stepDataCache.value[time]) {
      currentStepData.value = stepDataCache.value[time];
      return;
    }

    // Set loading state for step data specifically
    isLoading.value = true;
    error.value = null;
    try {
      const data = await getSimulationStepData(selectedSimulationId.value, time);
      stepDataCache.value[time] = data;
      currentStepData.value = data;
    } catch (e) {
      error.value = e.message;
      console.error(`Failed to fetch step data for time ${time}:`, e);
    } finally {
      isLoading.value = false;
    }
  }

  async function setCurrentTime(time) {
    const newTime = Math.max(timeRange.value.min, Math.min(time, timeRange.value.max));
    
    // Only fetch if time has actually changed
    if (currentTime.value === newTime && currentStepData.value != null) return;

    currentTime.value = newTime;
    await fetchStepData(newTime);
  }

  async function fetchNodeDetails(nodeId) {
    if (!selectedSimulationId.value || !currentStepData.value) return;

    isLoadingDetails.value = true;
    error.value = null;
    try {
      const details = await getSimulationCompanyDetails(
        selectedSimulationId.value,
        currentStepData.value.time,
        nodeId
      );
      selectedNodeDetails.value = details;
    } catch (e) {
      error.value = e.message;
      selectedNodeDetails.value = null;
      console.error(`Failed to fetch details for node ${nodeId}:`, e);
    } finally {
      isLoadingDetails.value = false;
    }
  }

  function setSelectedNodeById(nodeId) {
    if (selectedNodeId.value === nodeId) {
      clearSelectedNode();
    } else {
      selectedNodeId.value = nodeId;
      fetchNodeDetails(nodeId);
    }
  }

  function clearSelectedNode() {
    selectedNodeId.value = null;
    selectedNodeDetails.value = null;
  }

  async function createSimulation(formData) {
    isLoading.value = true;
    error.value = null;
    try {
      await createSimulationApi(formData);
      await fetchSimulations(); // Refresh the list
    } catch (e) {
      error.value = e.message;
      console.error('Failed to create simulation:', e);
      throw e; // re-throw to be caught in the component
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteSimulation(id) {
    isLoading.value = true;
    error.value = null;
    try {
      await deleteSimulationApi(id);
      if (selectedSimulationId.value === id) {
        selectedSimulationId.value = null;
        topology.value = null;
        currentStepData.value = null;
      }
      await fetchSimulations(); // Refresh the list
    } catch (e) {
      error.value = e.message;
      console.error(`Failed to delete simulation ${id}:`, e);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    simulations,
    selectedSimulationId,
    topology,
    currentStepData,
    selectedNodeDetails,
    selectedNodeId,
    currentTime,
    isLoading,
    isLoadingDetails,
    error,
    isAnimating,
    // Getters
    simulationOptions,
    timeRange,
    graphData,
    nodeUpdates,
    // Actions
    fetchSimulations,
    selectSimulation,
    setCurrentTime,
    setSelectedNodeById,
    clearSelectedNode,
    createSimulation,
    deleteSimulation,
    setAnimating,
  };
});
