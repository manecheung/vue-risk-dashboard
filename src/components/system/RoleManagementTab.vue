<template>
  <div>
    <!-- 新建角色按钮 -->
    <div class="flex justify-end items-center mb-6">
      <button
        v-if="authStore.hasPermission(['system:roles:manage'])"
        @click="openFormModal(null)"
        class="btn btn-primary shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
      >
        <i class="fas fa-plus mr-2"></i>新建角色
      </button>
    </div>

    <!-- 角色数据表格 -->
    <DataTable
      :columns="roleColumns"
      :items="store.roles"
      :loading="store.loading"
      :show-pagination="false"
      item-key="id"
    >
      <template #cell-actions="{ item }">
        <div class="flex justify-end items-center gap-x-4">
          <button
            v-if="authStore.hasPermission(['system:roles:manage'])"
            @click="openFormModal(item)"
            class="btn-action text-sky-400 hover:text-sky-300"
          >
            <i class="fas fa-pen mr-1"></i>
            编辑
          </button>
          <button
            v-if="authStore.hasPermission(['system:roles:manage'])"
            @click="openPermissionModal(item)"
            class="btn-action text-teal-400 hover:text-teal-300"
          >
            <i class="fas fa-shield-alt mr-1"></i>
            分配权限
          </button>
          <button
            v-if="authStore.hasPermission(['system:roles:manage'])"
            @click="handleDelete(item.id)"
            class="btn-action text-red-500 hover:text-red-400"
          >
            <i class="fas fa-trash-alt mr-1"></i>
            删除
          </button>
        </div>
      </template>
    </DataTable>

    <!-- 新建/编辑角色的表单模态框 -->
    <FormModal
      v-if="isFormModalOpen"
      :is-open="isFormModalOpen"
      :item="selectedItem"
      :form-config="roleFormConfig"
      :modal-title="modalTitle"
      @close="isFormModalOpen = false"
      @submit="handleSubmit"
    />

    <!-- 分配权限的模态框 -->
    <PermissionModal
      v-if="isPermissionModalOpen"
      :is-open="isPermissionModalOpen"
      :role="selectedItem"
      :permission-tree-data="permissionData"
      @close="isPermissionModalOpen = false"
      @save="handleSavePermissions"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSystemManagementStore } from '@/stores/systemManagementStore';
import { useAuthStore } from '@/stores/authStore';
import DataTable from '@/components/common/DataTable.vue';
import FormModal from './FormModal.vue';
import PermissionModal from './PermissionModal.vue';

const store = useSystemManagementStore();
const authStore = useAuthStore();

const isFormModalOpen = ref(false);
const isPermissionModalOpen = ref(false);
const selectedItem = ref(null);
const permissionData = ref(null); // 存储从后端获取的权限数据

const modalTitle = computed(() => (selectedItem.value && selectedItem.value.id ? '编辑角色' : '新建角色'));

const roleColumns = [
  { key: 'name', label: '角色名称' },
  { key: 'description', label: '描述', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'actions', label: '操作', headerClass: 'text-right', cellClass: 'text-right' },
];

const roleFormConfig = {
  fields: [
    { name: 'name', label: '角色名称', type: 'text', required: true },
    { name: 'description', label: '描述', type: 'textarea' },
  ]
};

// 组件挂载时获取角色列表
onMounted(() => {
  store.fetchRoles();
});

// 打开新建/编辑模态框
function openFormModal(item) {
  selectedItem.value = item ? { ...item } : {};
  isFormModalOpen.value = true;
}

// 打开分配权限模态框
async function openPermissionModal(item) {
  selectedItem.value = item;
  // 从 store 获取特定角色的权限信息
  permissionData.value = await store.getRolePermissions(item.id);
  console.log('Permission data received from store:', JSON.stringify(permissionData.value));
  if (permissionData.value) {
    isPermissionModalOpen.value = true;
  }
}

// 保存权限分配
async function handleSavePermissions(keys) {
  const success = await store.updateRolePermissions(selectedItem.value.id, keys);
  if (success) {
    isPermissionModalOpen.value = false;
  }
}

// 提交表单（新建或更新）
async function handleSubmit(item) {
  const success = await store.createOrUpdateItem('roles', item);
  if (success) {
    isFormModalOpen.value = false;
  }
}

// 处理删除操作
function handleDelete(id) {
  // 可以在这里加入二次确认逻辑
  store.deleteItem('roles', id);
}
</script>
