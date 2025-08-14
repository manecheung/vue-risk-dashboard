<template>
  <div>
    <!-- 顶部操作栏 -->
    <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-slate-200">组织结构</h3>
        <button
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
      <!-- 使用 :key 来强制刷新整个树，确保DOM在数据变更后完全重新渲染 -->
      <ul v-else-if="store.organizationsTree.length > 0" :key="JSON.stringify(store.organizationsTree)">
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
      @close="closeFormModal"
      @submit="handleSubmit"
    />

    <!-- 删除确认模态框 -->
    <ConfirmModal
      :is-open="isConfirmModalOpen"
      title="确认删除组织"
      message="您确定要删除该组织吗？如果该组织下有子组织，将一并被删除。此操作不可撤销。"
      @cancel="isConfirmModalOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSystemManagementStore } from '@/stores/systemManagementStore';
import FormModal from './FormModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import OrganizationNode from './OrganizationNode.vue';

const store = useSystemManagementStore();

const isFormModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const selectedItem = ref(null);
const itemToDeleteId = ref(null);
const modalTitle = ref('新建组织');

// --- 辅助函数 --- //

// 在树中查找特定ID的节点
const findNodeInTree = (id, tree) => {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeInTree(id, node.children);
      if (found) return found;
    }
  }
  return null;
};

// 查找节点及其所有后代的 ID
const getDescendantIds = (node) => {
  let ids = [node.id];
  if (node.children && node.children.length > 0) {
    ids = ids.concat(node.children.flatMap(getDescendantIds));
  }
  return ids;
};

// 将组织树扁平化为用于下拉选择的列表
const flattenOrganizationsForSelect = (orgs, prefix = '') => {
  return orgs.flatMap(org => {
    const list = [{ value: org.id, text: `${prefix}${org.name}` }];
    if (org.children && org.children.length > 0) {
      return list.concat(flattenOrganizationsForSelect(org.children, `${prefix}— `));
    }
    return list;
  });
};

// --- 响应式状态和计算属性 --- //

// 动态生成表单配置，用于新建和编辑组织
const organizationFormConfig = computed(() => {
  let disabledIds = [];
  // 如果是编辑模式，需要禁止将当前节点及其所有子节点选为自己的上级
  if (selectedItem.value && selectedItem.value.id) {
    const currentNode = findNodeInTree(selectedItem.value.id, store.organizationsTree);
    if (currentNode) {
      disabledIds = getDescendantIds(currentNode);
    }
  }

  const allOrgs = flattenOrganizationsForSelect(store.organizationsTree);
  const parentOptions = allOrgs.filter(org => !disabledIds.includes(org.value));

  return {
    fields: [
      { name: 'name', label: '组织名称', type: 'text', required: true },
      {
        name: 'manager',
        label: '负责人',
        type: 'select',
        options: store.allUsers?.map(u => ({ value: u.name, text: u.name })) || [],
        required: false,
        placeholder: '请选择负责人'
      },
      {
        name: 'parentId',
        label: '上级组织',
        type: 'select',
        options: [{ value: null, text: '无 (设为顶级组织)' }].concat(parentOptions),
        required: false,
      },
    ]
  };
});

// --- 生命周期钩子 --- //

onMounted(() => {
  // 组件挂载时，获取组织和用户数据
  store.fetchOrganizations();
  store.fetchAllUsers();
});

// --- 事件处理函数 --- //

const closeFormModal = () => {
  isFormModalOpen.value = false;
  selectedItem.value = null;
}

// 打开新建或编辑模态框
function openFormModal(item) {
  if (item) {
    // 编辑模式
    selectedItem.value = { ...item };
    modalTitle.value = '编辑组织';
  } else {
    // 新建根组织模式
    selectedItem.value = { name: '', manager: null, parentId: null };
    modalTitle.value = '新建根组织';
  }
  isFormModalOpen.value = true;
}

// 打开添加子组织模态框
function openAddChildModal(parent) {
  selectedItem.value = { name: '', manager: null, parentId: parent.id };
  modalTitle.value = `在“${parent.name}”下新建组织`;
  isFormModalOpen.value = true;
}

// 处理表单提交（新建或更新）
async function handleSubmit(item) {
  // 确保 parentId 为 null 而不是空字符串
  if (item.parentId === '' || item.parentId === undefined) {
    item.parentId = null;
  }
  
  let success = false;
  if (item.id) {
    // 调用专属的更新 action
    success = await store.updateOrganization(item);
  } else {
    // 调用专属的创建 action
    success = await store.createOrganization(item);
  }

  if (success) {
    closeFormModal();
    // store action 内部会自动刷新列表
  }
}

// 处理删除按钮点击
function handleDelete(id) {
  itemToDeleteId.value = id;
  isConfirmModalOpen.value = true;
}

// 确认删除
async function confirmDelete() {
  // 调用专属的删除 action
  const success = await store.deleteOrganization(itemToDeleteId.value);
  if (success) {
    isConfirmModalOpen.value = false;
    // store action 内部会自动刷新列表
  }
}
</script>