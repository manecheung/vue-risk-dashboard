<template>
  <main class="flex flex-col p-6" style="height: calc(100vh - 4rem);">
    <header class="flex-shrink-0 mb-4 text-sm text-slate-400" aria-label="面包屑导航">系统设置 / 系统管理</header>
    <div class="panel flex-grow min-h-0">
      <div class="flex-shrink-0 flex items-center border-b border-slate-700 px-4" role="tablist">
        <button @click="activeTab = 'users'"
          :class="{ 'border-b-2 border-sky-400 text-white': activeTab === 'users', 'text-slate-400': activeTab !== 'users' }"
          class="px-4 py-3 text-sm font-medium transition-colors hover:text-white" role="tab"
          aria-controls="users-panel">用户管理</button>
        <button @click="activeTab = 'roles'"
          :class="{ 'border-b-2 border-sky-400 text-white': activeTab === 'roles', 'text-slate-400': activeTab !== 'roles' }"
          class="px-4 py-3 text-sm font-medium transition-colors hover:text-white" role="tab"
          aria-controls="roles-panel">角色管理</button>
        <button @click="activeTab = 'orgs'"
          :class="{ 'border-b-2 border-sky-400 text-white': activeTab === 'orgs', 'text-slate-400': activeTab !== 'orgs' }"
          class="px-4 py-3 text-sm font-medium transition-colors hover:text-white" role="tab"
          aria-controls="orgs-panel">组织管理</button>
      </div>

      <div class="flex-grow min-h-0 overflow-y-auto custom-scrollbar relative">
        <!-- Users Panel -->
        <div v-show="activeTab === 'users'" id="users-panel" role="tabpanel" class="p-4 space-y-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <input type="text" v-model="userSearchKeyword" @keydown.enter="handleUserSearch" class="form-input" placeholder="搜索用户名或姓名...">
              <button @click="handleUserSearch" class="btn btn-secondary">搜索</button>
            </div>
            <button @click="openModal(ITEM_TYPES.USER)" class="btn btn-primary text-sm">新增用户</button>
          </div>
          <DataTable :columns="userColumns" :items="store.users" min-width="800px" aria-label="用户列表" empty-message="暂无用户">
            <template #cell-status="{ item }">
              <span :class="item.status === '正常' ? 'text-green-400' : 'text-red-400'">{{ item.status }}</span>
            </template>
            <template #cell-actions="{ item }">
              <div class="space-x-4">
                <button @click="openModal(ITEM_TYPES.USER, item)" class="text-sky-400 hover:text-sky-200">编辑</button>
                <button @click="openConfirmModal(ITEM_TYPES.USER, item)" class="text-red-400 hover:text-red-200">删除</button>
              </div>
            </template>
          </DataTable>
           <div class="flex justify-center mt-4">
              <button @click="changeUserPage(store.pagination.page - 1)" :disabled="!store.pagination.hasPrevPage" class="btn btn-secondary text-sm">上一页</button>
              <span class="px-4 py-2 text-sm">第 {{ store.pagination.page }} / {{ store.pagination.totalPages }} 页</span>
              <button @click="changeUserPage(store.pagination.page + 1)" :disabled="!store.pagination.hasNextPage" class="btn btn-secondary text-sm">下一页</button>
            </div>
        </div>

        <!-- Roles Panel -->
        <div v-show="activeTab === 'roles'" id="roles-panel" role="tabpanel" class="p-4 space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">角色列表</h3>
            <button @click="openModal(ITEM_TYPES.ROLE)" class="btn btn-primary text-sm">新增角色</button>
          </div>
          <DataTable :columns="roleColumns" :items="store.roleList" min-width="800px" aria-label="角色列表" empty-message="暂无角色">
            <template #cell-actions="{ item }">
              <div class="space-x-4">
                <button @click="openPermissionModal(item)" class="text-amber-400 hover:text-amber-200">授权</button>
                <button @click="openModal(ITEM_TYPES.ROLE, item)" class="text-sky-400 hover:text-sky-200">编辑</button>
                <button @click="openConfirmModal(ITEM_TYPES.ROLE, item)" class="text-red-400 hover:text-red-200">删除</button>
              </div>
            </template>
          </DataTable>
        </div>

        <!-- Organizations Panel -->
        <div v-show="activeTab === 'orgs'" id="orgs-panel" role="tabpanel" class="p-4 space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">组织架构</h3>
            <button @click="openModal(ITEM_TYPES.ORG)" class="btn btn-primary text-sm">新增组织</button>
          </div>
          <DataTable :columns="orgColumns" :items="store.organizationTree" :is-tree="true" min-width="600px" aria-label="组织架构列表" empty-message="暂无组织">
            <template #cell-actions="{ item }">
              <div class="space-x-4">
                <button @click="openModal(ITEM_TYPES.ORG, item)" class="text-sky-400 hover:text-sky-200">编辑</button>
                <button @click="openConfirmModal(ITEM_TYPES.ORG, item)" class="text-red-400 hover:text-red-200">删除</button>
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </div>

    <FormModal :is-open="isFormModalOpen" :form-type="formType" :item-data="currentItem" :roles="store.roleList"
      :organizations="store.orgListForSelect" @close="closeModal" @save="handleSave" />
    <PermissionModal 
      :is-open="isPermissionModalOpen" 
      :role="currentItem" 
      :all-permissions="store.allPermissions"
      :assigned-permissions="store.permissions.assignedKeys"
      @close="closeModal" 
      @save="handleSavePermissions" />
    <ConfirmModal :is-open="isConfirmModalOpen" title="确认删除" @confirm="handleDelete" @cancel="closeModal">
      <p>您确定要删除“<strong class="text-amber-400">{{ currentItem?.name }}</strong>”吗？</p>
      <p class="mt-2 text-sm text-slate-500">此操作无法撤销。</p>
    </ConfirmModal>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSystemManagementStore } from '@/stores/systemManagementStore';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import FormModal from '@/components/system/FormModal.vue';
import PermissionModal from '@/components/system/PermissionModal.vue';
import DataTable from '@/components/common/DataTable.vue';
import { ITEM_TYPES } from '@/constants/system';

const store = useSystemManagementStore();

const activeTab = ref('users');
const isFormModalOpen = ref(false);
const isPermissionModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const currentItem = ref(null);
const formType = ref('');
const userSearchKeyword = ref('');

const userColumns = [
  { key: 'username', label: '用户名' },
  { key: 'name', label: '姓名' },
  { key: 'role', label: '角色' },
  { key: 'organization', label: '所属组织' },
  { key: 'status', label: '状态' },
  { key: 'lastLogin', label: '上次登录' },
  { key: 'actions', label: '操作', cellClass: 'text-center' }
];

const roleColumns = [
  { key: 'name', label: '角色名称' },
  { key: 'description', label: '描述' },
  { key: 'actions', label: '操作', cellClass: 'text-center' }
];

const orgColumns = [
  { key: 'name', label: '组织名称' },
  { key: 'parent', label: '上级组织' },
  { key: 'manager', label: '负责人' },
  { key: 'userCount', label: '成员数' },
  { key: 'actions', label: '操作', cellClass: 'text-center' }
];

onMounted(() => {
  store.fetchAll();
});

const openModal = (type, item = null) => {
  formType.value = type;
  currentItem.value = item ? { ...item } : null;
  isFormModalOpen.value = true;
};

const openPermissionModal = async (role) => {
  currentItem.value = { ...role };
  await store.fetchRolePermissions(role.id);
  isPermissionModalOpen.value = true;
};

const openConfirmModal = (type, item) => {
  formType.value = type;
  currentItem.value = item;
  isConfirmModalOpen.value = true;
};

const closeModal = () => {
  isFormModalOpen.value = false;
  isPermissionModalOpen.value = false;
  isConfirmModalOpen.value = false;
  currentItem.value = null;
  formType.value = '';
};

const handleSave = async (data) => {
  const isEdit = !!data.id;
  switch (formType.value) {
    case ITEM_TYPES.USER:
      await (isEdit ? store.updateUser(data.id, data) : store.addUser(data));
      break;
    case ITEM_TYPES.ROLE:
      await (isEdit ? store.updateRole(data.id, data) : store.addRole(data));
      break;
    case ITEM_TYPES.ORG:
      await (isEdit ? store.updateOrganization(data.id, data) : store.addOrganization(data));
      break;
  }
  closeModal();
};

const handleSavePermissions = async (permissionKeys) => {
  if (currentItem.value?.id) {
    await store.updateRolePermissions(currentItem.value.id, permissionKeys);
  }
  closeModal();
};

const handleDelete = async () => {
  if (!currentItem.value?.id) return;
  switch (formType.value) {
    case ITEM_TYPES.USER:
      await store.deleteUser(currentItem.value.id);
      break;
    case ITEM_TYPES.ROLE:
      await store.deleteRole(currentItem.value.id);
      break;
    case ITEM_TYPES.ORG:
      await store.deleteOrganization(currentItem.value.id);
      break;
  }
  closeModal();
};

const handleUserSearch = () => {
  store.fetchUsers(1, userSearchKeyword.value);
}

const changeUserPage = (page) => {
  store.fetchUsers(page, userSearchKeyword.value);
}

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #1e293b;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>