import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';
import { useFeedbackStore } from './feedbackStore';

export const useSystemManagementStore = defineStore('systemManagement', () => {
  const feedback = useFeedbackStore();

  // 状态 (State)
  const users = ref([]);
  const allUsers = ref([]); // For dropdowns
  const roles = ref([]);
  const organizationsTree = ref([]);
  
  const pagination = ref({
    page: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const loading = ref(false);

  // --- Getters ---
  const organizationsWithManagerNames = computed(() => {
    const userMap = new Map(allUsers.value.map(u => [u.id, u.name]));
    
    function enrichTree(nodes) {
      return nodes.map(node => {
        const managerName = userMap.get(node.managerId) || '未指定';
        const children = node.children ? enrichTree(node.children) : null;
        return { ...node, manager: managerName, children };
      });
    }
    
    return enrichTree(organizationsTree.value);
  });

  // --- 用户管理 Actions ---
  async function fetchUsers(page = 1, pageSize = 10, keyword = '') {
    loading.value = true;
    try {
      const params = { page, pageSize };
      if (keyword) {
        params.keyword = keyword;
      }
      const response = await api.get('/system/users', { params });
      const data = response.data.data;
      users.value = data.records;
      pagination.value = {
        page: data.page,
        pageSize: data.pageSize,
        totalRecords: data.totalRecords,
        totalPages: data.totalPages,
      };
    } catch (error) {
      feedback.show('获取用户列表失败: ' + (error.response?.data?.message || '您可能没有权限查看用户，或网络发生错误。'), 'error');
    } finally {
      loading.value = false;
    }
  }

  async function fetchAllUsers() {
    try {
      const response = await api.get('/system/users', { params: { page: 1, pageSize: 9999 } });
      allUsers.value = response.data.data.records;
    } catch (error) {
      feedback.show('获取所有用户列表失败: ' + (error.response?.data?.message || '网络错误'), 'error');
    }
  }

  // --- 角色管理 Actions ---
  async function fetchRoles() {
    loading.value = true;
    try {
      const response = await api.get('/system/roles');
      roles.value = response.data.data;
    } catch (error) {
      feedback.show('获取角色列表失败: ' + (error.response?.data?.message || '您可能没有权限查看角色，或网络发生错误。'), 'error');
    } finally {
      loading.value = false;
    }
  }

  async function getRolePermissions(roleId) {
    try {
      const response = await api.get(`/system/roles/${roleId}/permissions`);
      return response.data.data;
    } catch (error) {
      feedback.show('获取角色权限失败: ' + (error.response?.data?.message || '网络错误，请稍后再试。'), 'error');
      return null;
    }
  }

  async function updateRolePermissions(roleId, permissionKeys) {
    try {
      await api.put(`/system/roles/${roleId}/permissions`, { permissionKeys });
      feedback.show('权限更新成功！', 'success');
      return true;
    } catch (error) {
      feedback.show('权限更新失败: ' + (error.response?.data?.message || '网络错误，请稍后再试。'), 'error');
      return false;
    }
  }

  // --- 组织管理 Actions ---
  async function fetchOrganizations() {
    loading.value = true;
    try {
      const response = await api.get('/system/organizations');
      organizationsTree.value = response.data.data;
    } catch (error) {
      feedback.show('获取组织结构失败: ' + (error.response?.data?.message || '您可能没有权限查看组织，或网络发生错误。'), 'error');
    } finally {
      loading.value = false;
    }
  }

  async function createOrganization(orgData) {
    try {
      await api.post('/system/organizations', orgData);
      feedback.show('组织创建成功！', 'success');
      await fetchOrganizations(); // 刷新整个树
      return true;
    } catch (error) {
      feedback.show('组织创建失败: ' + (error.response?.data?.message || '网络错误'), 'error');
      return false;
    }
  }

  async function updateOrganization(orgData) {
    try {
      await api.put(`/system/organizations/${orgData.id}`, orgData);
      feedback.show('组织更新成功！', 'success');
      await fetchOrganizations(); // 刷新整个树
      return true;
    } catch (error) {
      feedback.show('组织更新失败: ' + (error.response?.data?.message || '网络错误'), 'error');
      return false;
    }
  }

  async function deleteOrganization(id) {
    try {
      await api.delete(`/system/organizations/${id}`);
      feedback.show('组织删除成功！', 'success');
      await fetchOrganizations(); // 刷新整个树
      return true;
    } catch (error) {
      feedback.show('组织删除失败: ' + (error.response?.data?.message || '网络错误'), 'error');
      return false;
    }
  }

  // --- 通用 Actions (保留用户和角色部分) ---
  async function createOrUpdateItem(type, item) {
    if (type === 'organizations') {
      console.warn('createOrUpdateItem is deprecated for organizations. Use createOrganization or updateOrganization instead.');
      const isCreating = !item.id;
      return isCreating ? createOrganization(item) : updateOrganization(item);
    }

    const isCreating = !item.id;
    const url = isCreating ? `/system/${type}` : `/system/${type}/${item.id}`;
    const method = isCreating ? 'post' : 'put';

    try {
      await api[method](url, item);
      feedback.show(`${isCreating ? '创建' : '更新'}成功！`, 'success');
      if (type === 'users') {
        await fetchUsers(pagination.value.page, pagination.value.pageSize);
        await fetchAllUsers(); // <-- 关键改动：刷新所有用户列表
      }
      else if (type === 'roles') await fetchRoles();
      return true;
    } catch (error) {
      feedback.show(`${isCreating ? '创建' : '更新'}失败: ` + (error.response?.data?.message || '网络错误，请稍后再试。'), 'error');
      return false;
    }
  }

  async function deleteItem(type, id) {
    if (type === 'organizations') {
      console.warn('deleteItem is deprecated for organizations. Use deleteOrganization instead.');
      return deleteOrganization(id);
    }

    try {
      await api.delete(`/system/${type}/${id}`);
      feedback.show('删除成功！', 'success');
      if (type === 'users') await fetchUsers(pagination.value.page, pagination.value.pageSize);
      else if (type === 'roles') await fetchRoles();
      return true;
    } catch (error) {
      feedback.show('删除失败: ' + (error.response?.data?.message || '网络错误，请稍后再试。'), 'error');
      return false;
    }
  }

  function reset() {
    users.value = [];
    allUsers.value = [];
    roles.value = [];
    organizationsTree.value = [];
    pagination.value = {
      page: 1,
      pageSize: 10,
      totalRecords: 0,
      totalPages: 1,
    };
    loading.value = false;
  }

  function reset() {
    users.value = [];
    allUsers.value = [];
    roles.value = [];
    organizationsTree.value = [];
    pagination.value = {
      page: 1,
      pageSize: 10,
      totalRecords: 0,
      totalPages: 1,
    };
    loading.value = false;
  }

  return {
    users,
    allUsers,
    roles,
    organizationsTree,
    pagination,
    loading,
    fetchUsers,
    fetchAllUsers,
    fetchRoles,
    fetchOrganizations,
    getRolePermissions,
    updateRolePermissions,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    createOrUpdateItem,
    deleteItem,
    organizationsWithManagerNames,
    reset,
  };
});