<template>
  <div>
    <!-- 顶部操作栏：搜索框和新建按钮 -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div class="w-full sm:w-auto lg:w-1/3">
        <div class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input
            type="text"
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
            placeholder="按用户名或姓名搜索..."
            class="form-input w-full pl-10 bg-slate-700/50 border-slate-600 hover:border-sky-600/70 focus:border-sky-500 focus:ring-sky-500/50 transition"
          />
        </div>
      </div>
      <button
        v-if="authStore.hasPermission(['system:users:manage'])"
        @click="openModalWithPreparation(null)"
        class="btn btn-primary w-full sm:w-auto shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
      >
        <i class="fas fa-plus mr-2"></i>新建用户
      </button>
    </div>

    <!-- 用户数据表格 -->
    <DataTable
      :columns="userColumns"
      :items="store.users"
      :loading="store.loading"
      :pagination="store.pagination"
      @page-change="handlePageChange"
      item-key="id"
    >
      <template #cell-roles="{ item }">
        <div v-if="item.roles && item.roles.length > 0" class="flex flex-wrap gap-2">
          <span v-for="(role, index) in item.roles" :key="index" 
                class="badge bg-teal-400/20 text-teal-300 border border-teal-400/30">
            {{ role }}
          </span>
        </div>
        <span v-else class="text-slate-500 text-xs">未分配</span>
      </template>
      <template #cell-status="{ item }">
         <span :class="['badge', item.status === '正常' ? 'badge-green' : 'badge-red']">
          <span class="badge-dot" :class="item.status === '正常' ? 'bg-green-400' : 'bg-red-400'"></span>
          {{ item.status }}
        </span>
      </template>
      <template #cell-actions="{ item }">
        <div class="flex justify-end items-center gap-x-4">
          <button
            v-if="authStore.hasPermission(['system:users:manage'])"
            @click="openModalWithPreparation(item)"
            class="btn-action text-sky-400 hover:text-sky-300"
          >
            <i class="fas fa-pen mr-1"></i>
            编辑
          </button>
          <button
            v-if="authStore.hasPermission(['system:users:manage'])"
            @click="handleDelete(item.id)"
            class="btn-action text-red-500 hover:text-red-400"
          >
            <i class="fas fa-trash-alt mr-1"></i>
            删除
          </button>
        </div>
      </template>
    </DataTable>

    <!-- 新建/编辑用户的表单模态框 -->
    <FormModal
      v-if="isFormModalOpen"
      :is-open="isFormModalOpen"
      :item="selectedItem"
      :form-config="userFormConfig"
      :modal-title="modalTitle"
      @close="closeFormModal"
      @submit="handleSubmit"
    />

    <!-- 删除确认模态框 -->
    <ConfirmModal
      :is-open="isConfirmModalOpen"
      title="确认删除"
      message="您确定要删除这个用户吗？此操作一旦执行将无法撤销。"
      @confirm="confirmDeletion"
      @cancel="closeDeleteConfirmation"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSystemManagementStore } from '@/stores/systemManagementStore';
import { useAuthStore } from '@/stores/authStore';
import { useCrudModal } from '@/composables/useCrudModal';
import DataTable from '@/components/common/DataTable.vue';
import FormModal from '../common/FormModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';

const store = useSystemManagementStore();
const authStore = useAuthStore();

// 使用组合式函数管理表单模态框
const { isFormModalOpen, selectedItem, modalTitle, openFormModal, closeFormModal } = useCrudModal('用户');

const searchKeyword = ref('');

// 删除确认模态框状态
const isConfirmModalOpen = ref(false);
const itemToDeleteId = ref(null);

// 定义数据表格的列
const userColumns = [
  { key: 'username', label: '用户名' },
  { key: 'name', label: '姓名' },
  { key: 'organization', label: '所属组织', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'roles', label: '角色', slot: 'roles', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'status', label: '状态', slot: 'status', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'lastLogin', label: '创建时间', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'actions', label: '操作', headerClass: 'text-right', cellClass: 'text-right' },
];

// 递归函数，用于将树形结构的组织扁平化
function flattenOrganization(org) {
  const list = [{ id: org.id, name: org.name }];
  if (org.children && org.children.length > 0) {
    return list.concat(org.children.flatMap(flattenOrganization));
  }
  return list;
}

// 定义表单模态框的配置
const userFormConfig = computed(() => ({
  fields: [
    { name: 'username', label: '用户名', type: 'text', required: true, disabled: !!(selectedItem.value && selectedItem.value.id) },
    { name: 'name', label: '姓名', type: 'text', required: true },
    { name: 'password', label: '密码', type: 'password', placeholder: '留空则不修改', required: !(selectedItem.value && selectedItem.value.id) },
    { name: 'organizationId', label: '所属组织', type: 'select', options: store.organizationsTree.flatMap(flattenOrganization).map(o => ({ value: o.id, text: o.name })), required: true },
    { name: 'roleIds', label: '角色', type: 'checkbox', options: store.roles.map(r => ({ value: r.id, text: r.name })), required: true },
    { name: 'status', label: '状态', type: 'select', options: [{value: '正常', text: '正常'}, {value: '锁定', text: '锁定'}], required: true },
  ]
}));

// 组件挂载时，获取初始数据
onMounted(() => {
  store.fetchUsers();
  store.fetchRoles(); // 为表单中的角色选择提供数据
  store.fetchOrganizations(); // 为表单中的组织选择提供数据
});

// 处理搜索
function handleSearch() {
  store.fetchUsers(1, store.pagination.pageSize, searchKeyword.value);
}

// 处理分页变化
function handlePageChange(page) {
  store.fetchUsers(page, store.pagination.pageSize, searchKeyword.value);
}

// 打开模态框前的数据准备钩子
function prepareUserData(item) {
  let roleIds = [];
  if (item && item.roles) {
    roleIds = store.roles
      .filter(r => item.roles.includes(r.name))
      .map(r => r.id);
  }

  let orgId = null;
  if (item && item.organization) {
    const org = store.organizationsTree.flatMap(flattenOrganization).find(o => o.name === item.organization);
    if (org) orgId = org.id;
  }
  
  return item.id 
    ? { ...item, roleIds, organizationId: orgId } 
    : { status: '正常', roleIds: [] };
}

// 打开新建/编辑模态框 (包含数据准备逻辑)
function openModalWithPreparation(item) {
  openFormModal(item, prepareUserData);
}

// 提交表单（新建或更新）
async function handleSubmit(item) {
  const success = await store.createOrUpdateItem('users', item);
  if (success) {
    closeFormModal();
  }
}

// 打开删除确认模态框
function openDeleteConfirmation(id) {
  itemToDeleteId.value = id;
  isConfirmModalOpen.value = true;
}

// 关闭删除确认模态框
function closeDeleteConfirmation() {
  isConfirmModalOpen.value = false;
  itemToDeleteId.value = null;
}

// 确认删除
async function confirmDeletion() {
  if (itemToDeleteId.value) {
    await store.deleteItem('users', itemToDeleteId.value);
    closeDeleteConfirmation();
  }
}

// 将旧的 handleDelete 重命名为 openDeleteConfirmation
const handleDelete = openDeleteConfirmation;
</script>

