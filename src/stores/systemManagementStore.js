import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  getUsers,
  addUser as apiAddUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  getRoles,
  addRole as apiAddRole,
  updateRole as apiUpdateRole,
  deleteRole as apiDeleteRole,
  getRolePermissions,
  updateRolePermissions as apiUpdateRolePermissions,
  getOrganizationTree,
  addOrganization as apiAddOrganization,
  updateOrganization as apiUpdateOrganization,
  deleteOrganization as apiDeleteOrganization,
} from '@/services/api';
import { useFeedbackStore } from './feedbackStore';

export const useSystemManagementStore = defineStore('systemManagement', () => {
  const feedback = useFeedbackStore();

  // --- State ---
  const users = ref([]);
  const roles = ref([]);
  const organizationTree = ref([]);
  const permissions = ref({ assignedKeys: [], permissionTree: [] });
  
  // 与后端 DataInitializer.java 保持同步
  const allPermissions = ref([
    'dashboard', 
    'dashboard:view', 
    'monitoring', 
    'monitoring:view', 
    'chain-risk', 
    'chain-risk:view', 
    'chain-risk:manage', 
    'supply-chain', 
    'supply-chain:view', 
    'supply-chain:manage', 
    'system', 
    'system:users:manage', 
    'system:roles:manage', 
    'system:orgs:manage'
  ]);

  const isLoading = ref(false);
  const error = ref(null);
  const pagination = ref({ page: 1, pageSize: 10, totalRecords: 0, totalPages: 1 });

  // --- Getters ---
  const roleList = computed(() => roles.value.map(r => ({ id: r.id, name: r.name, description: r.description })));
  const orgListForSelect = computed(() => {
      const list = [];
      function flatten(nodes) {
          for (const node of nodes) {
              list.push({ id: node.id, name: node.name });
              if (node.children && node.children.length > 0) {
                  flatten(node.children);
              }
          }
      }
      flatten(organizationTree.value);
      return list;
  });

  // --- Actions ---

  async function fetchAll() {
    isLoading.value = true;
    error.value = null;
    try {
      await Promise.all([
        fetchUsers(),
        fetchRoles(),
        fetchOrganizationTree(),
      ]);
    } catch (err) {
      error.value = err.message;
      feedback.show('系统管理核心数据加载失败', 'error');
    } finally {
      isLoading.value = false;
    }
  }

  // Users
  async function fetchUsers(page = 1, keyword = '') {
    isLoading.value = true;
    try {
      const params = { page, pageSize: pagination.value.pageSize, keyword: keyword || null };
      const data = await getUsers(params);
      users.value = data.records;
      pagination.value = { ...pagination.value, ...data };
    } catch (err) {
      error.value = err.message;
      feedback.show(`用户列表加载失败: ${err.message}`, 'error');
    } finally {
      isLoading.value = false;
    }
  }

  async function addUser(userData) {
    try {
      await apiAddUser(userData);
      feedback.show('用户添加成功', 'success');
      await fetchUsers(pagination.value.page);
    } catch (err) {
      feedback.show(`用户添加失败: ${err.message}`, 'error');
    }
  }

  async function updateUser(id, userData) {
    try {
      await apiUpdateUser(id, userData);
      feedback.show('用户更新成功', 'success');
      await fetchUsers(pagination.value.page);
    } catch (err) {
      feedback.show(`用户更新失败: ${err.message}`, 'error');
    }
  }

  async function deleteUser(id) {
    try {
      await apiDeleteUser(id);
      feedback.show('用户删除成功', 'success');
      await fetchUsers(pagination.value.page);
    } catch (err) {
      feedback.show(`用户删除失败: ${err.message}`, 'error');
    }
  }

  // Roles
  async function fetchRoles() {
    try {
      roles.value = await getRoles();
    } catch (err) {
        feedback.show(`角色列表加载失败: ${err.message}`, 'error');
    }
  }
  
  async function addRole(roleData) {
      try {
          await apiAddRole(roleData);
          feedback.show('角色添加成功', 'success');
          await fetchRoles();
      } catch (err) {
          feedback.show(`角色添加失败: ${err.message}`, 'error');
      }
  }

  async function updateRole(id, roleData) {
      try {
          await apiUpdateRole(id, roleData);
          feedback.show('角色更新成功', 'success');
          await fetchRoles();
      } catch (err) {
          feedback.show(`角色更新失败: ${err.message}`, 'error');
      }
  }

  async function deleteRole(id) {
      try {
          await apiDeleteRole(id);
          feedback.show('角色删除成功', 'success');
          await fetchRoles();
      } catch (err) {
          feedback.show(`角色删除失败: ${err.message}`, 'error');
      }
  }

  // Permissions
  async function fetchRolePermissions(roleId) {
    isLoading.value = true;
    try {
      permissions.value = await getRolePermissions(roleId);
    } catch (err) {
      feedback.show(`权限加载失败: ${err.message}`, 'error');
    } finally {
      isLoading.value = false;
    }
  }

  async function updateRolePermissions(roleId, keys) {
    try {
      await apiUpdateRolePermissions(roleId, keys);
      feedback.show('权限更新成功', 'success');
    } catch (err) {
      feedback.show(`权限更新失败: ${err.message}`, 'error');
    }
  }
  
  // Organizations
  async function fetchOrganizationTree() {
    try {
      organizationTree.value = await getOrganizationTree();
    } catch (err) {
      feedback.show(`组织架构加载失败: ${err.message}`, 'error');
    }
  }
  
  async function addOrganization(orgData) {
      try {
          await apiAddOrganization(orgData);
          feedback.show('组织添加成功', 'success');
          await fetchOrganizationTree();
      } catch (err) {
          feedback.show(`组织添加失败: ${err.message}`, 'error');
      }
  }

  async function updateOrganization(id, orgData) {
      try {
          await apiUpdateOrganization(id, orgData);
          feedback.show('组织更新成功', 'success');
          await fetchOrganizationTree();
      } catch (err) {
          feedback.show(`组织更新失败: ${err.message}`, 'error');
      }
  }

  async function deleteOrganization(id) {
    try {
        await apiDeleteOrganization(id);
        feedback.show('组织删除成功', 'success');
        await fetchOrganizationTree();
    } catch (err) {
        feedback.show(`组织删除失败: ${err.message}`, 'error');
    }
  }

  return {
    users,
    roles,
    organizationTree,
    permissions,
    allPermissions,
    isLoading,
    error,
    pagination,
    roleList,
    orgListForSelect,
    fetchAll,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    fetchRoles,
    addRole,
    updateRole,
    deleteRole,
    fetchRolePermissions,
    updateRolePermissions,
    fetchOrganizationTree,
    addOrganization,
    updateOrganization,
    deleteOrganization,
  };
});