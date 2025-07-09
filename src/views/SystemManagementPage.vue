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
        <div v-show="activeTab === 'users'" id="users-panel" role="tabpanel" class="p-4 space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">用户列表</h3><button @click="openModal(ITEM_TYPES.USER)"
              class="btn btn-primary text-sm">新增用户</button>
          </div>
          <DataTable :columns="userColumns" :items="store.usersWithDetails" min-width="800px" aria-label="用户列表"
            empty-message="暂无用户">
            <template #cell-status="{ item }">
              <span :class="item.status === '正常' ? 'text-green-400' : 'text-red-400'">{{ item.status }}</span>
            </template>
            <template #cell-actions="{ item }">
              <div class="space-x-4">
                <button @click="openModal(ITEM_TYPES.USER, item)" class="text-sky-400 hover:text-sky-200">编辑</button>
                <button @click="openConfirmModal(ITEM_TYPES.USER, item)"
                  class="text-red-400 hover:text-red-200">删除</button>
              </div>
            </template>
          </DataTable>
        </div>

        <div v-show="activeTab === 'roles'" id="roles-panel" role="tabpanel" class="p-4 space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">角色列表</h3><button @click="openModal(ITEM_TYPES.ROLE)"
              class="btn btn-primary text-sm">新增角色</button>
          </div>
          <DataTable :columns="roleColumns" :items="store.roleList" min-width="800px" aria-label="角色列表"
            empty-message="暂无角色">
            <template #cell-name="{ item }">
              <span class="font-semibold text-slate-200">{{ item.name }}</span>
            </template>
            <template #cell-permissions="{ item }">
              <div class="flex flex-wrap gap-2">
                <span v-for="p in item.permissions" :key="p"
                  class="bg-sky-500/10 text-sky-300 text-xs px-2 py-1 rounded-full">{{ p }}</span>
              </div>
            </template>
            <template #cell-actions="{ item }">
              <div class="space-x-4">
                <button @click="openModal(ITEM_TYPES.PERMISSION, item)"
                  class="text-amber-400 hover:text-amber-200">授权</button>
                <button @click="openModal(ITEM_TYPES.ROLE, item)" class="text-sky-400 hover:text-sky-200">编辑</button>
                <button @click="openConfirmModal(ITEM_TYPES.ROLE, item)"
                  class="text-red-400 hover:text-red-200">删除</button>
              </div>
            </template>
          </DataTable>
        </div>

        <div v-show="activeTab === 'orgs'" id="orgs-panel" role="tabpanel" class="p-4 space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">组织架构</h3><button @click="openModal(ITEM_TYPES.ORG)"
              class="btn btn-primary text-sm">新增组织</button>
          </div>
          <DataTable :columns="orgColumns" :items="store.orgList" min-width="600px" aria-label="组织架构列表"
            empty-message="暂无组织">
            <template #cell-actions="{ item }">
              <div class="space-x-4">
                <button @click="openModal(ITEM_TYPES.ORG, item)" class="text-sky-400 hover:text-sky-200">编辑</button>
                <button @click="openConfirmModal(ITEM_TYPES.ORG, item)"
                  class="text-red-400 hover:text-red-200">删除</button>
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </div>

    <FormModal :is-open="isFormModalOpen" :form-type="formType" :item-data="currentItem" :roles="store.roleNames"
      :organizations="store.orgNames" :org-parent-options="orgParentOptions" :user-options="store.userNames"
      @close="closeModal" @save="handleSave" />
    <PermissionModal :is-open="isPermissionModalOpen" :role="currentItem" :all-permissions="store.allPermissions"
      @close="closeModal" @save="handleSavePermissions" />
    <ConfirmModal :is-open="isConfirmModalOpen" title="确认删除" @confirm="handleDelete" @cancel="closeModal">
      <p>您确定要删除“<strong class="text-amber-400">{{ currentItem?.name }}</strong>”吗？</p>
      <p class="mt-2 text-sm text-slate-500">此操作无法撤销，请谨慎操作。</p>
    </ConfirmModal>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
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

const userColumns = [
  { key: 'username', label: '用户名', cellClass: 'text-center' },
  { key: 'name', label: '姓名', cellClass: 'text-center' },
  { key: 'role', label: '角色', cellClass: 'text-center' },
  { key: 'organization', label: '所属组织', cellClass: 'text-center' },
  { key: 'status', label: '状态', cellClass: 'text-center' },
  { key: 'lastLogin', label: '上次登录', cellClass: 'text-center' },
  { key: 'actions', label: '操作', cellClass: 'text-center' }
];

const roleColumns = [
  { key: 'name', label: '角色名称', cellClass: 'text-left' },
  { key: 'description', label: '描述', cellClass: 'text-left' },
  { key: 'permissions', label: '拥有权限', cellClass: 'text-left' },
  { key: 'actions', label: '操作', cellClass: 'text-left' }
];

const orgColumns = [
  { key: 'name', label: '组织名称', cellClass: 'text-center' },
  { key: 'parent', label: '上级组织', cellClass: 'text-center' },
  { key: 'manager', label: '负责人', cellClass: 'text-center' },
  { key: 'userCount', label: '成员数', cellClass: 'text-center' },
  { key: 'actions', label: '操作', cellClass: 'text-center' }
];

const orgParentOptions = computed(() => {
  const allOrgs = store.orgNames;
  if (formType.value === ITEM_TYPES.ORG && currentItem.value?.id) {
    return ['-', ...allOrgs.filter(name => name !== currentItem.value.name)];
  }
  return ['-', ...allOrgs];
});

const openModal = (type, item = null) => {
  const fullItem = item ? (type === ITEM_TYPES.USER ? store.usersWithDetails.find(u => u.id === item.id) : item) : null;
  formType.value = type;
  currentItem.value = fullItem;
  if (type === ITEM_TYPES.PERMISSION) {
    isPermissionModalOpen.value = true;
  } else {
    isFormModalOpen.value = true;
  }
};

const openConfirmModal = (type, item) => {
  if (store.canDeleteItem(type, item)) {
    formType.value = type;
    currentItem.value = item;
    isConfirmModalOpen.value = true;
  }
};

const closeModal = () => {
  isFormModalOpen.value = false;
  isPermissionModalOpen.value = false;
  isConfirmModalOpen.value = false;
  currentItem.value = null;
  formType.value = '';
};

const handleSave = async (data) => {
  await store.saveItem(formType.value, data);
  closeModal();
};

const handleSavePermissions = async (permissions) => {
  await store.savePermissions(currentItem.value.id, permissions);
  closeModal();
};

const handleDelete = async () => {
  await store.deleteItem(formType.value, currentItem.value.id);
  closeModal();
};
</script>