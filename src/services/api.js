import { 
  MOCK_DASHBOARD_DATA, 
  MOCK_MONITORING_DATA, 
  MOCK_SUPPLYCHAIN_DATA, 
  MOCK_SYSTEM_DATA 
} from '@/data/mockData';

const simulateDelay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

async function apiCall(promise) {
  try {
    await simulateDelay();
    const data = await promise;
    // structuredClone is generally better than JSON.parse(JSON.stringify(...))
    return { data: structuredClone(data), error: null };
  } catch (error) {
    console.error("API Call Failed:", error);
    return { data: null, error: error instanceof Error ? error : new Error('An unknown error occurred') };
  }
}

export const getDashboardData = () => apiCall(Promise.resolve(MOCK_DASHBOARD_DATA));
export const getMonitoringData = () => apiCall(Promise.resolve(MOCK_MONITORING_DATA));
export const getSupplyChainData = () => apiCall(Promise.resolve(MOCK_SUPPLYCHAIN_DATA));
export const getSystemData = () => apiCall(Promise.resolve(MOCK_SYSTEM_DATA));