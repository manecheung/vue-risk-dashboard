import { defineStore } from 'pinia';
import { ref } from 'vue';
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

  // 操作 (Actions)

  /**
   * 获取用户列表（分页）
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @param {string} keyword - 搜索关键词
   */
  async function fetchUsers(page = 1, pageSize = 10, keyword = '') {
    loading.value = true;
    try {
      const params = { page, pageSize };
      if (keyword) {
        params.keyword = keyword;
      }
      const response = await api.get('/system/users', { params });
      const data = response.data.data;
      users.value = data.records; // 后端返回的是 records
      pagination.value = {
        page: data.page,
        pageSize: data.pageSize,
        totalRecords: data.totalRecords,
        totalPages: data.totalPages,
      };
    } catch (error) {
      // 修正：调用正确的 feedbackStore 方法
      feedback.show('获取用户列表失败: ' + (error.response?.data?.message || '您可能没有权限查看用户，或网络发生错误。'), 'error');
    } finally {
      loading.value = false;
    }
  }

  /**
   * 获取所有用户，用于下拉列表
   */
  async function fetchAllUsers() {
    try {
      const response = await api.get('/system/users', { params: { page: 1, pageSize: 9999 } });
      allUsers.value = response.data.data.records;
    } catch (error) {
      feedback.show('获取所有用户列表失败: ' + (error.response?.data?.message || '网络错误'), 'error');
    }
  }

  /**
   * 获取所有角色
   */
  async function fetchRoles() {
    loading.value = true;
    try {
      const response = await api.get('/system/roles');
      roles.value = response.data.data;
    } catch (error) {
      // 修正：调用正确的 feedbackStore 方法
      feedback.show('获取角色列表失败: ' + (error.response?.data?.message || '您可能没有权限查看角色，或网络发生错误。'), 'error');
    } finally {
      loading.value = false;
    }
  }

  /**
   * 获取组织架构树
   */
  async function fetchOrganizations() {
    loading.value = true;
    try {
      const response = await api.get('/system/organizations');
      organizationsTree.value = response.data.data;
    } catch (error) {
      // 修正：调用正确的 feedbackStore 方法
      feedback.show('获取组织结构失败: ' + (error.response?.data?.message || '您可能没有权限查看组织，或网络发生错误。'), 'error');
    } finally {
      loading.value = false;
    }
  }

  /**
   * 根据角色ID获取其权限信息
   * @param {number} roleId - 角色ID
   */
  async function getRolePermissions(roleId) {
    try {
      const response = await api.get(`/system/roles/${roleId}/permissions`);
      return response.data.data; // 返回 { assignedKeys, permissionTree }
    } catch (error) {
      feedback.show('获取角色权限失败: ' + (error.response?.data?.message || '网络错误，请稍后再试。'), 'error');
      return null;
    }
  }

  /**
   * 更新角色的权限
   * @param {number} roleId - 角色ID
   * @param {string[]} permissionKeys - 权限键名数组
   */
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

  /**
   * 通用的创建或更新函数
   * @param {'users' | 'roles' | 'organizations'} type - 操作的类型
   * @param {object} item - 要创建或更新的数据项
   */
  async function createOrUpdateItem(type, item) {
    const isCreating = !item.id;
    const url = isCreating ? `/system/${type}` : `/system/${type}/${item.id}`;
    const method = isCreating ? 'post' : 'put';

    try {
      await api[method](url, item);
      feedback.show(`${isCreating ? '创建' : '更新'}成功！`, 'success');
      // 操作成功后刷新对应的数据
      if (type === 'users') await fetchUsers(pagination.value.page, pagination.value.pageSize);
      else if (type === 'roles') await fetchRoles();
      else if (type === 'organizations') await fetchOrganizations();
      return true;
    } catch (error) {
      feedback.show(`${isCreating ? '创建' : '更新'}失败: ` + (error.response?.data?.message || '网络错误，请稍后再试。'), 'error');
      return false;
    }
  }

  /**
   * 通用的删除函数
   * @param {'users' | 'roles' | 'organizations'} type - 操作的类型
   * @param {number} id - 要删除的数据项ID
   */
  async function deleteItem(type, id) {
    try {
      await api.delete(`/system/${type}/${id}`);
      feedback.show('删除成功！', 'success');
      // 操作成功后刷新对应的数据
      if (type === 'users') await fetchUsers(pagination.value.page, pagination.value.pageSize);
      else if (type === 'roles') await fetchRoles();
      else if (type === 'organizations') await fetchOrganizations();
      return true;
    } catch (error) {
      feedback.show('删除失败: ' + (error.response?.data?.message || '网络错误，请稍后再试。'), 'error');
      return false;
    }
  }

  return {
    users,
    allUsers, // <-- export new state
    roles,
    organizationsTree,
    pagination,
    loading,
    fetchUsers,
    fetchAllUsers, // <-- export new action
    fetchRoles,
    fetchOrganizations,
    getRolePermissions,
    updateRolePermissions,
    createOrUpdateItem,
    deleteItem,
  };
});
