import axios from 'axios';
import router from '@/router'; // 引入 router
import { useAuthStore } from '@/stores/authStore'; // 引入 authStore

// 创建并配置axios实例
const api = axios.create({
  baseURL: '/api', // 修改为相对路径，以便Vite代理能够拦截
  headers: {
    'Content-Type': 'application/json',
  }
});

// 添加请求拦截器，在每个请求头中添加token
api.interceptors.request.use(
  config => {
    const authStore = useAuthStore();
    const token = authStore.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


// 添加响应拦截器，处理全局错误，特别是401 Unauthorized
api.interceptors.response.use(
  // 对成功响应直接放行
  response => response,
  // 对错误响应进行统一处理
  async error => {
    if (error.response && error.response.status === 403 || error.response.status === 401) {
      // 如果是403错误，说明token无效或已过期
      const authStore = useAuthStore();
      // 调用登出逻辑，清除本地token和用户信息
      authStore.logout();
      // 跳转到登录页面，并携带当前路径作为查询参数，以便登录后能返回原页面
      await router.push({
        path: '/login',
        query: { redirect: router.currentRoute.value.fullPath }
      });
    }
    // 抛出错误，以便业务代码中的catch块可以捕获并处理
    return Promise.reject(error);
  }
);

// 统一处理响应的辅助函数
async function handleResponse(promise) {
  try {
    const response = await promise;
    if (response.data && response.data.code === 200) {
      return response.data.data;
    }
    // 处理后端返回的业务逻辑错误
    const errorMsg = response.data ? response.data.message : '请求失败，未知错误';
    console.error("API Logic Error:", errorMsg);
    throw new Error(errorMsg);
  } catch (error) {
    // 处理网络或服务器级别的错误
    console.error("API Call Failed:", error);
    const errorMsg = error.response ? error.response.data.message : error.message;
    throw new Error(errorMsg);
  }
}

// ==================================================================
// 认证接口 (Authentication)
// ==================================================================
// 登录/登出逻辑已移至 authStore.js 中直接使用导出的 api 实例，此处不再导出

// ==================================================================
// 首页仪表盘模块 (Dashboard)
// ==================================================================
export const getKeyMetrics = () => handleResponse(api.get('/dashboard/key-metrics'));
export const getRiskDistribution = () => handleResponse(api.get('/dashboard/risk-distribution'));
export const getIndustryHealth = () => handleResponse(api.get('/dashboard/industry-health'));
export const getSupplyChainRisk = () => handleResponse(api.get('/dashboard/supply-chain-risk'));
export const getRiskAnalysis = (params) => handleResponse(api.get('/dashboard/risk-analysis', { params }));
export const getRiskMap = () => handleResponse(api.get('/dashboard/risk-map'));
export const getKnowledgeGraph = (params) => handleResponse(api.get('/dashboard/graph', { params }));

// ==================================================================
// 风险监测模块 (Monitoring)
// ==================================================================
export const getMonitoringArticles = (params) => handleResponse(api.get('/monitoring/articles', { params }));
export const getArticleDetail = (id) => handleResponse(api.get(`/monitoring/articles/${id}`));


// ==================================================================
// 风险蔓延模拟模块 (Simulation)
// ==================================================================
/**
 * 对模拟器相关接口进行API调用，采用更直接的响应/错误处理。
 * @param {Promise} promise axios promise
 * @returns {Promise<any>} Resolves with response.data or rejects with an error object.
 */
async function handleSimulationResponse(promise) {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    console.error("Simulation API Call Failed:", error);
    const errorInfo = {
      message: error.response?.data?.error || error.message || 'An unknown error occurred',
      status: error.response?.status || 500,
    };
    throw errorInfo;
  }
}

export const getAllSimulations = () => handleSimulationResponse(api.get('/simulations'));
export const getSimulationTopology = (id) => handleSimulationResponse(api.get(`/simulations/${id}/graph/topology`));
export const getSimulationStepData = (id, time) => handleSimulationResponse(api.get(`/simulations/${id}/step/${time}`));
export const getSimulationCompanyDetails = (id, time, companyId) => handleSimulationResponse(api.get(`/simulations/${id}/step/${time}/company/${companyId}`));
export const deleteSimulation = (id) => handleSimulationResponse(api.delete(`/simulations/${id}`));
export const createSimulation = (formData) => {
  return handleSimulationResponse(api.post('/simulations', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }));
};


// ==================================================================
// 供应链管理模块 (Supply Chain)
// ==================================================================
export const getSupplyChainSummary = () => handleResponse(api.get('/supply-chain/summary'));
export const getSupplyChainCompanies = (params) => handleResponse(api.get('/supply-chain/companies', { params }));
export const getAllCompanies = () => handleResponse(api.get('/supply-chain/all-companies'));
export const getCompanyDetails = (id) => handleResponse(api.get(`/supply-chain/companies/${id}`));
export const addCompany = (companyData) => handleResponse(api.post('/supply-chain/companies', companyData));
export const updateCompany = (id, companyData) => handleResponse(api.put(`/supply-chain/companies/${id}`, companyData));
export const deleteCompany = (id) => handleResponse(api.delete(`/supply-chain/companies/${id}`));

// ==================================================================
// 系统管理模块 (System Management)
// ==================================================================
export const getUsers = (params) => handleResponse(api.get('/system/users', { params }));
export const getUserDetails = (id) => handleResponse(api.get(`/system/users/${id}`));
export const addUser = (userData) => handleResponse(api.post('/system/users', userData));
export const updateUser = (id, userData) => handleResponse(api.put(`/system/users/${id}`, userData));
export const deleteUser = (id) => handleResponse(api.delete(`/system/users/${id}`));

export const getRoles = () => handleResponse(api.get('/system/roles'));
export const addRole = (roleData) => handleResponse(api.post('/system/roles', roleData));
export const updateRole = (id, roleData) => handleResponse(api.put(`/system/roles/${id}`, roleData));
export const deleteRole = (id) => handleResponse(api.delete(`/system/roles/${id}`));
export const getRolePermissions = (id) => handleResponse(api.get(`/system/roles/${id}/permissions`));
export const updateRolePermissions = (id, permissionKeys) => handleResponse(api.put(`/system/roles/${id}/permissions`, { permissionKeys }));

export const getOrganizationTree = () => handleResponse(api.get('/system/organizations'));
export const addOrganization = (orgData) => handleResponse(api.post('/system/organizations', orgData));
export const updateOrganization = (id, orgData) => handleResponse(api.put(`/system/organizations/${id}`, orgData));
export const deleteOrganization = (id) => handleResponse(api.delete(`/system/organizations/${id}`));

// 默认导出axios实例，供authStore等需要直接访问实例的地方使用
export default api;
