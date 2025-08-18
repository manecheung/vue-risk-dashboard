<template>
  <div>
    <!-- 新建角色按钮 -->
    <div class="flex justify-end items-center mb-6">
      <button v-if="authStore.hasPermission(['system:roles:manage'])" @click="openFormModal(null)"
        class="btn btn-primary shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30">
        <i class="fas fa-plus mr-2"></i>新建角色
      </button>
    </div>

    <!-- 角色数据表格 -->
    <DataTable :columns="roleColumns" :items="store.roles" :loading="store.loading" :show-pagination="false"
      item-key="id">
      <template #cell-actions="{ item }">
        <div class="flex justify-end items-center gap-x-4">
          <button v-if="authStore.hasPermission(['system:roles:manage'])" @click="openFormModal(item)"
            class="btn-action text-sky-400 hover:text-sky-300">
            <i class="fas fa-pen mr-1"></i>
            编辑
          </button>
          <button v-if="authStore.hasPermission(['system:roles:manage'])" @click="openPermissionModal(item)"
            class="btn-action text-teal-400 hover:text-teal-300">
            <i class="fas fa-shield-alt mr-1"></i>
            分配权限
          </button>
          <button v-if="authStore.hasPermission(['system:roles:manage'])" @click="handleDelete(item.id)"
            class="btn-action text-red-500 hover:text-red-400">
            <i class="fas fa-trash-alt mr-1"></i>
            删除
          </button>
        </div>
      </template>
    </DataTable>

    <!-- 新建/编辑角色的表单模态框 -->
    <FormModal v-if="isFormModalOpen" :is-open="isFormModalOpen" :item="selectedItem" :form-config="roleFormConfig"
      :modal-title="modalTitle" @close="closeFormModal" @submit="handleSubmit" />

    <!-- 
      分配权限的模态框
      最终修复方案：添加一个 :key 属性。
      每次打开模态框时，我们都改变这个 key 的值，
      这将强制 Vue 销毁旧的 PermissionModal 实例并创建一个全新的实例。
      这能确保模态框内部的状态在每次打开时都是完全纯净的，从而解决顽固的初始化状态问题。
    -->
    <PermissionModal v-if="isPermissionModalOpen" :key="permissionModalKey" :is-open="isPermissionModalOpen" :role="permissionRole"
      :permission-tree-data="permissionData" @close="closePermissionModal" @save="handleSavePermissions" />

    <!-- 删除确认模态框 -->
    <ConfirmModal :is-open="isConfirmModalOpen" title="确认删除角色" message="您确定要删除该角色吗？此操作不可撤销。"
      @cancel="isConfirmModalOpen = false" @confirm="confirmDelete" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSystemManagementStore } from '@/stores/systemManagementStore';
import { useAuthStore } from '@/stores/authStore';
import { useCrudModal } from '@/composables/useCrudModal';
import DataTable from '@/components/common/DataTable.vue';
import FormModal from '../common/FormModal.vue';
import PermissionModal from './PermissionModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';

const store = useSystemManagementStore();
const { fetchRoles, createOrUpdateItem, deleteItem, getRolePermissions, updateRolePermissions } = store;
const authStore = useAuthStore();

// --- 状态管理 --- //
const { isFormModalOpen, selectedItem, modalTitle, openFormModal, closeFormModal } = useCrudModal('角色');
const isPermissionModalOpen = ref(false);
const permissionData = ref(null);
const permissionRole = ref(null);
const isConfirmModalOpen = ref(false);
const itemToDeleteId = ref(null);
// 新增一个 key 用于强制刷新 PermissionModal 组件
const permissionModalKey = ref(0);

// --- 表格和表单配置 --- //
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

// --- 生命周期 --- //
onMounted(() => {
  fetchRoles();
});

// --- 主要方法 --- //

async function openPermissionModal(item) {
  if (!item || !item.id) {
    console.error("无效的角色数据:", item);
    return;
  }

  try {
    const data = await getRolePermissions(item.id);
    if (data) {
      permissionRole.value = item;
      permissionData.value = data;
      
      // 核心修复：递增 key 的值，这将导致 PermissionModal 被强制重新创建
      permissionModalKey.value++;
      
      isPermissionModalOpen.value = true;
    } else {
      console.error("获取到的权限数据为空");
    }
  } catch (error) {
    console.error("获取角色权限失败:", error);
  }
}

const closePermissionModal = () => {
  isPermissionModalOpen.value = false;
  // 关闭时不需要重置 permissionData，因为下一次打开时组件会重建
}

async function handleSavePermissions(keys) {
  const success = await updateRolePermissions(permissionRole.value.id, keys);
  if (success) {
    closePermissionModal();
  }
}

async function handleSubmit(item) {
  const success = await createOrUpdateItem('roles', item);
  if (success) {
    closeFormModal();
  }
}

function handleDelete(id) {
  itemToDeleteId.value = id;
  isConfirmModalOpen.value = true;
}

async function confirmDelete() {
  const success = await deleteItem('roles', itemToDeleteId.value);
  if (success) {
    isConfirmModalOpen.value = false;
  }
}
</script>