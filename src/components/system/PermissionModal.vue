<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 -translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-4"
      >
        <!-- 模态框主面板 -->
        <div v-if="isOpen" class="w-full max-w-2xl flex flex-col bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl">
          <h2 class="panel-title text-xl font-semibold px-6 py-4">为角色 "{{ role?.name }}" 分配权限</h2>
          
          <!-- 权限树区域 -->
          <div class="px-6 py-2 border-y border-slate-700/80 overflow-y-auto custom-scrollbar" style="max-height: 60vh;">
            <div v-if="!permissionTreeData" class="text-center text-slate-400 py-10">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              正在加载权限...
            </div>
            <div v-else-if="!processedTreeData || processedTreeData.size === 0" class="text-center text-slate-500 py-10">
                <i class="fas fa-exclamation-circle mr-2"></i>
                没有可分配的权限。
            </div>
            <ul v-else>
              <!-- 递归渲染权限树 -->
              <PermissionNode
                v-for="node in permissionTreeData.permissionTree"
                :key="node.key"
                :node="node"
                :processed-tree="processedTreeData"
                :is-selected="processedTreeData.get(node.key).isSelected"
                :is-indeterminate="processedTreeData.get(node.key).isIndeterminate"
                @toggle="handleToggle"
              />
            </ul>
          </div>

          <!-- 底部操作按钮 -->
          <div class="flex justify-end space-x-4 p-4 bg-slate-900/30 rounded-b-xl">
            <button @click="$emit('close')" class="btn btn-secondary">取消</button>
            <button @click="save" class="btn btn-primary shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30">保存权限</button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import PermissionNode from './PermissionNode.vue';

const props = defineProps({
  isOpen: Boolean,
  role: Object,
  permissionTreeData: Object, // 包含 { assignedKeys, permissionTree } 的对象
});

const emit = defineEmits(['close', 'save']);

// 状态：这个 Set 是唯一的数据源，驱动整个组件的状态
const selectedKeys = ref(new Set());

// --- 辅助函数 --- //

// 将嵌套的树结构扁平化为 Map，方便通过 key 快速查找节点
const flatTree = computed(() => {
  const flat = new Map();
  function flatten(nodes) {
    for (const node of nodes) {
      flat.set(node.key, { ...node, children: node.children?.map(c => c.key) || [] });
      if (node.children) {
        flatten(node.children);
      }
    }
  }
  if (props.permissionTreeData?.permissionTree) {
    flatten(props.permissionTreeData.permissionTree);
  }
  return flat;
});

// 递归获取一个节点及其所有后代节点的 key
function getDescendantKeys(nodeKey, keySet) {
  const node = flatTree.value.get(nodeKey);
  if (!node) return;
  keySet.add(nodeKey);
  if (node.children) {
    node.children.forEach(childKey => getDescendantKeys(childKey, keySet));
  }
}

// --- 核心逻辑：计算每个节点的显示状态 --- //

// 根据 selectedKeys 派生出每个节点的 isSelected 和 isIndeterminate 状态
const processedTreeData = computed(() => {
  const processed = new Map();
  if (flatTree.value.size === 0) return processed;

  // 从叶子节点开始，反向遍历树，确保在处理父节点时，其所有子节点都已被处理
  const keys = Array.from(flatTree.value.keys()).reverse();

  for (const key of keys) {
    const node = flatTree.value.get(key);
    const childrenKeys = node.children || [];

    if (childrenKeys.length === 0) {
      // 叶子节点：其状态仅取决于它是否存在于 selectedKeys 中
      processed.set(key, {
        isSelected: selectedKeys.value.has(key),
        isIndeterminate: false,
      });
    } else {
      // 父节点：其状态由其子节点的状态派生而来
      const childrenStatus = childrenKeys.map(childKey => processed.get(childKey));
      const selectedCount = childrenStatus.filter(s => s.isSelected).length;
      const indeterminateCount = childrenStatus.filter(s => s.isIndeterminate).length;

      if (selectedCount === childrenKeys.length) {
        // 所有子节点都全选 -> 父节点也全选
        processed.set(key, { isSelected: true, isIndeterminate: false });
      } else if (selectedCount > 0 || indeterminateCount > 0) {
        // 部分子节点被选中或处于不确定状态 -> 父节点为不确定状态
        processed.set(key, { isSelected: false, isIndeterminate: true });
      } else {
        // 所有子节点都未选 -> 父节点也未选
        processed.set(key, { isSelected: false, isIndeterminate: false });
      }
    }
  }
  return processed;
});

// --- 事件处理 --- //

// 处理节点复选框的点击事件
const handleToggle = (node) => {
  const newSelectedKeys = new Set(selectedKeys.value);
  const isSelected = processedTreeData.value.get(node.key)?.isSelected;

  const allRelatedKeys = new Set();
  getDescendantKeys(node.key, allRelatedKeys);

  if (isSelected) {
    // 当前是“全选”状态，则取消选中所有相关节点
    allRelatedKeys.forEach(key => newSelectedKeys.delete(key));
  } else {
    // 当前是“未选”或“不确定”状态，则全选所有相关节点
    allRelatedKeys.forEach(key => newSelectedKeys.add(key));
  }
  selectedKeys.value = newSelectedKeys;
};

// 监听模态框打开，初始化状态
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.permissionTreeData?.assignedKeys) {
    // 初始的 assignedKeys 可能只包含父节点，需要进行扩展
    const initialKeys = new Set(props.permissionTreeData.assignedKeys);
    const completeKeys = new Set(initialKeys);
    // 确保如果一个父节点被选中，其所有子孙节点也被隐式选中
    initialKeys.forEach(key => {
      getDescendantKeys(key, completeKeys);
    });
    selectedKeys.value = completeKeys;
  } else {
    selectedKeys.value = new Set();
  }
});

// 保存按钮点击事件
const save = () => {
  // 在保存时，我们只需要提交那些在原始树中存在的key
  const keysToSave = Array.from(selectedKeys.value).filter(key => flatTree.value.has(key));
  emit('save', keysToSave);
};

</script>