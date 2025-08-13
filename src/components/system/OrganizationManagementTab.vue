<template>
  <div>
    <!-- 顶部操作栏 -->
    <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-slate-200">组织结构</h3>
        <button
            v-if="authStore.hasPermission(['system:orgs:manage'])"
            @click="openFormModal(null)"
            class="btn btn-primary shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
        >
            <i class="fas fa-plus mr-2"></i>新建根组织
        </button>
    </div>

    <!-- 组织树容器 -->
    <div class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 min-h-[300px]">
      <div v-if="store.loading" class="flex justify-center items-center h-full text-slate-400">
        <i class="fas fa-spinner fa-spin mr-2"></i>
        加载中...
      </div>
      <ul v-else-if="store.organizationsTree.length > 0">
        <!-- 递归渲染组织节点 -->
        <OrganizationNode
          v-for="node in store.organizationsTree"
          :key="node.id"
          :node="node"
          @edit="openFormModal"
          @delete="handleDelete"
          @add-child="openAddChildModal"
        />
      </ul>
      <div v-else class="flex justify-center items-center h-full text-slate-500">
        <i class="fas fa-folder-open mr-2"></i>
        暂无组织数据。
      </div>
    </div>

    <!-- 新建/编辑组织的表单模态框 -->
    <FormModal
      v-if="isFormModalOpen"
      :is-open="isFormModalOpen"
      :item="selectedItem"
      :form-config="organizationFormConfig"
      :modal-title="modalTitle"
      @close="isFormModalOpen = false"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSystemManagementStore } from '@/stores/systemManagementStore';
import { useAuthStore } from '@/stores/authStore';
import FormModal from './FormModal.vue';
import OrganizationNode from './OrganizationNode.vue'; // 静态导入以支持递归

const store = useSystemManagementStore();
const authStore = useAuthStore();

const isFormModalOpen = ref(false);
const selectedItem = ref(null);

const modalTitle = computed(() => (selectedItem.value && selectedItem.value.id ? '编辑组织' : '新建组织'));

// 表单配置
const organizationFormConfig = computed(() => ({
  fields: [
    { name: 'name', label: '组织名称', type: 'text', required: true },
    {
      name: 'manager',
      label: '负责人',
      type: 'select',
      options: store.allUsers.map(u => ({ value: u.name, text: u.name })),
      required: false
    },
    {
      name: 'parentId',
      label: '上级组织',
      type: 'select',
      // 将组织树扁平化，用于下拉选择框
      options: [{ value: null, text: '无 (顶级组织)' }].concat(
        store.organizationsTree.flatMap(o => flattenOrganization(o))
          .map(o => ({ value: o.id, text: o.name }))
      ),
      required: false
    },
  ]
}));

/**
 * 递归函数，将树形结构的组织扁平化，以便在下拉菜单中显示。
 * @param {object} org - 当前组织节点。
 * @param {string} prefix - 用于表示层级的前缀。
 * @returns {Array} - 扁平化后的组织列表。
 */
function flattenOrganization(org, prefix = '') {
  const list = [{ id: org.id, name: `${prefix}${org.name}` }];
  if (org.children && org.children.length > 0) {
    return list.concat(org.children.flatMap(child => flattenOrganization(child, `${prefix}— `)));
  }
  return list;
}

// 组件挂载时获取组织数据
onMounted(() => {
  store.fetchOrganizations();
  store.fetchAllUsers(); // 获取用户列表用于负责人下拉菜单
});

// 打开新建/编辑模态框
function openFormModal(item) {
  selectedItem.value = item ? { ...item } : { name: '', manager: '', parentId: null };
  isFormModalOpen.value = true;
}

// 打开为父组织添加子组织的模态框
function openAddChildModal(parent) {
  selectedItem.value = { name: '', manager: '', parentId: parent.id };
  isFormModalOpen.value = true;
}

// 提交表单（新建或更新）
async function handleSubmit(item) {
  const success = await store.createOrUpdateItem('organizations', item);
  if (success) {
    isFormModalOpen.value = false;
  }
}

// 处理删除操作
function handleDelete(id) {
  // 实际项目中应在此处调用一个确认对话框
  store.deleteItem('organizations', id);
}
</script>
