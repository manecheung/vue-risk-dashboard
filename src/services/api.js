import axios from 'axios';

// 创建并配置axios实例
const api = axios.create({
  baseURL: '/api', // 修改为相对路径，以便Vite代理能够拦截
  headers: {
    'Content-Type': 'application/json',
  }
});

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
// 产业链风险预警模块 (Chain Risk)
// ==================================================================
export const getSimulations = (params) => handleResponse(api.get('/chain-risk/simulations', { params }));
export const saveSimulation = (data) => handleResponse(api.post('/chain-risk/simulations', data));
export const runSimulation = (id, startNodeId) => handleResponse(api.post(`/chain-risk/simulations/${id}/run`, { startNodeId }));
export const deleteSimulation = (id) => handleResponse(api.delete(`/chain-risk/simulations/${id}`));
export const runNewSimulation = (startNodeName) => handleResponse(api.post('/chain-risk/run-new', { startNodeName }));


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
