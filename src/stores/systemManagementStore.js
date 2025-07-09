import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getSystemData } from '@/services/api';
import { useFeedbackStore } from './feedbackStore';

const normalizeById = (array) => {
  return array.reduce((obj, item) => {
    obj[item.id] = item;
    return obj;
  }, {});
};

export const useSystemManagementStore = defineStore('systemManagement', () => {
  const feedback = useFeedbackStore();

  const users = ref({});
  const roles = ref({});
  const organizations = ref({});
  const allPermissions = ref([]);

  const roleList = computed(() => Object.values(roles.value));
  const orgList = computed(() => Object.values(organizations.value));
  const userList = computed(() => Object.values(users.value));

  const roleNameMap = computed(() => roleList.value.reduce((map, item) => {
    map[item.name] = item.name;
    return map;
  }, {}));

  const orgNameMap = computed(() => orgList.value.reduce((map, item) => {
    map[item.name] = item.name;
    return map;
  }, {}));

  const roleNames = computed(() => roleList.value.map(r => r.name));
  const orgNames = computed(() => orgList.value.map(o => o.name));
  const userNames = computed(() => userList.value.map(u => u.name));

  const usersWithDetails = computed(() => {
    const rolesMap = roleNameMap.value;
    const orgsMap = orgNameMap.value;
    
    return userList.value.map(user => {
      const roleName = rolesMap[user.role] || '未知角色';
      const orgName = orgsMap[user.organization] || '未知组织';
      return {
        ...user,
        role: roleName,
        organization: orgName,
      };
    });
  });

  async function fetchData() {
    const { data, error } = await getSystemData();
    if(error){
        feedback.show('系统管理数据加载失败', 'error');
        return;
    }
    users.value = normalizeById(data.users);
    roles.value = normalizeById(data.roles);
    organizations.value = normalizeById(data.organizations);
    allPermissions.value = data.allPermissions;
  }

  fetchData();
  
  async function saveItem(type, data) {
    const collectionRef = { user: users, role: roles, org: organizations }[type];
    if (!collectionRef) return false;

    if (data.id) {
      collectionRef.value[data.id] = { ...collectionRef.value[data.id], ...data };
    } else {
      const newId = Date.now();
      const newItem = { ...data, id: newId };
      if (type === 'user') newItem.lastLogin = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
      if (type === 'org') newItem.userCount = 0;
      collectionRef.value[newId] = newItem;
    }
    feedback.show('保存成功', 'success');
    return true;
  }

  async function savePermissions(roleId, newPermissions) {
    if (roles.value[roleId]) {
      roles.value[roleId].permissions = newPermissions;
      feedback.show('权限更新成功', 'success');
      return true;
    }
    return false;
  }

  function canDeleteItem(type, item) {
    if (type === 'org') {
      const hasChildren = orgList.value.some(org => org.parent === item.name && org.id !== item.id);
      if (hasChildren) {
        feedback.show(`无法删除：组织 "${item.name}" 被用作其他组织的上级。`, 'error');
        return false;
      }
      const hasUsers = userList.value.some(user => user.organization === item.name);
      if (hasUsers) {
        feedback.show(`无法删除：组织 "${item.name}" 下仍有用户，请先转移用户。`, 'error', 5000);
        return false;
      }
    }
    if (type === 'role') {
        const hasUsers = userList.value.some(user => user.role === item.name);
        if(hasUsers) {
            feedback.show(`无法删除：角色 "${item.name}" 仍有用户在使用。`, 'error', 5000);
            return false;
        }
    }
    return true;
  }

  async function deleteItem(type, itemId) {
    const collectionRef = { user: users, role: roles, org: organizations }[type];
    if (collectionRef.value[itemId]) {
      const itemName = collectionRef.value[itemId].name;
      delete collectionRef.value[itemId];
      feedback.show(`“${itemName}”已删除`, 'success');
      return true;
    }
    return false;
  }

  return {
    users, roles, organizations, allPermissions,
    userList, roleList, orgList,
    usersWithDetails, roleNames, orgNames, userNames,
    saveItem,
    savePermissions,
    canDeleteItem,
    deleteItem,
    fetchData,
  };
});