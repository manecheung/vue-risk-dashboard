import axios from 'axios';

// 设置基础URL
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 确保这与你的后端端口一致
  headers: {
    'Content-Type': 'application/json',
  }
});

// 统一处理响应的函数
async function apiCall(promise) {
  try {
    const response = await promise;
    // 后端返回的数据结构是 { code, message, data }
    if (response.data && response.data.code === 200) {
      return { data: response.data.data, error: null };
    }
    // 处理业务逻辑错误
    const errorMsg = response.data ? response.data.message : '未知错误';
    console.error("API Logic Error:", errorMsg);
    return { data: null, error: new Error(errorMsg) };
  } catch (error) {
    // 处理网络或服务器错误
    console.error("API Call Failed:", error);
    const errorMsg = error.response ? error.response.data.message : error.message;
    return { data: null, error: new Error(errorMsg) };
  }
}

// ==================================================================
// 认证接口 (Authentication)
// ==================================================================
export const login = (credentials) => apiCall(apiClient.post('/auth/login', credentials));

// ==================================================================
// 首页仪表盘模块 (Dashboard)
// ==================================================================
export const getKeyMetrics = () => apiCall(apiClient.get('/dashboard/key-metrics'));
export const getRiskDistribution = () => apiCall(apiClient.get('/dashboard/risk-distribution'));
export const getIndustryHealth = () => apiCall(apiClient.get('/dashboard/industry-health'));
export const getSupplyChainRisk = () => apiCall(apiClient.get('/dashboard/supply-chain-risk'));
export const getRiskAnalysis = (params) => apiCall(apiClient.get('/dashboard/risk-analysis', { params }));
export const getRiskMap = () => apiCall(apiClient.get('/dashboard/risk-map'));
export const getKnowledgeGraph = (params) => apiCall(apiClient.get('/dashboard/graph', { params }));


// ==================================================================
// 供应链管理模块 (Supply Chain)
// ==================================================================
export const getSupplyChainSummary = () => apiCall(apiClient.get('/supply-chain/summary'));
export const getSupplyChainCompanies = (params) => apiCall(apiClient.get('/supply-chain/companies', { params }));
export const getCompanyDetails = (id) => apiCall(apiClient.get(`/supply-chain/companies/${id}`));
export const addCompany = (companyData) => apiCall(apiClient.post('/supply-chain/companies', companyData));
export const updateCompany = (id, companyData) => apiCall(apiClient.put(`/supply-chain/companies/${id}`, companyData));
export const deleteCompany = (id) => apiCall(apiClient.delete(`/supply-chain/companies/${id}`));


// ==================================================================
// 风险监测模块 (Monitoring) - 保持不动，除非需要
// ==================================================================
import { MOCK_MONITORING_DATA } from '@/data/mockData';
const simulateDelay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));
export const getMonitoringData = () => (async () => {
    await simulateDelay();
    return { data: MOCK_MONITORING_DATA, error: null };
})();


// ==================================================================
// 系统管理模块 (System Management) - 保持不动，除非需要
// ==================================================================
import { MOCK_SYSTEM_DATA } from '@/data/mockData';
export const getSystemData = () => (async () => {
    await simulateDelay();
    return { data: MOCK_SYSTEM_DATA, error: null };
})();
