<template>
  <li class="list-none my-1">
    <div class="flex items-center p-2 rounded-md hover:bg-slate-700/50 transition-colors duration-150">
      <!-- 折叠/展开图标 -->
      <button @click="isExpanded = !isExpanded" v-if="hasChildren" class="w-7 h-7 flex-shrink-0 rounded-full hover:bg-slate-600/50 flex items-center justify-center text-slate-400 mr-1">
        <i :class="['fas fa-chevron-right text-xs transition-transform', { 'rotate-90': isExpanded }]"></i>
      </button>
      <div v-else class="w-7 mr-1 flex-shrink-0"></div>

      <!-- 自定义复选框和标签 -->
      <label :for="node.key" class="flex items-center cursor-pointer flex-grow select-none" @click.prevent="$emit('toggle', node)">
        <span :class="['custom-checkbox', { 'selected': isSelected, 'indeterminate': isIndeterminate }]">
          <i v-if="isSelected" class="fas fa-check check-icon"></i>
          <i v-else-if="isIndeterminate" class="fas fa-minus check-icon"></i>
        </span>
        <span class="ml-3 text-slate-300">{{ node.label }}</span>
      </label>
    </div>

    <!-- 子节点列表 -->
    <ul v-if="hasChildren && isExpanded" class="pl-10 mt-1 pt-1 border-l-2 border-slate-800">
      <!-- 注意这里，我们将父组件计算好的状态直接传递给子组件 -->
      <PermissionNode
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :processed-tree="processedTree"
        :is-selected="processedTree.get(child.key).isSelected"
        :is-indeterminate="processedTree.get(child.key).isIndeterminate"
        @toggle="$emit('toggle', $event)"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue';

// 使用 defineOptions 宏来定义组件名称，以便在模板中进行递归引用
defineOptions({
  name: 'PermissionNode'
});

const props = defineProps({
  node: { type: Object, required: true },
  // processedTree 是一个 Map，包含所有节点的处理后状态
  processedTree: { type: Map, required: true },
  // isSelected 和 isIndeterminate 由父组件计算后传入
  isSelected: { type: Boolean, required: true },
  isIndeterminate: { type: Boolean, required: true },
});

defineEmits(['toggle']);

const isExpanded = ref(true);
const hasChildren = computed(() => props.node.children && props.node.children.length > 0);
</script>

<style scoped>
.custom-checkbox {
  width: 1.25rem; /* 20px */
  height: 1.25rem; /* 20px */
  border-radius: 0.375rem; /* 6px */
  border-width: 2px;
  border-color: #4A5568; /* slate-600 */
  background-color: #2D3748; /* slate-700 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;
}

.custom-checkbox:hover {
  border-color: #718096; /* slate-500 */
}

.custom-checkbox.selected {
  background-color: #0ea5e9; /* sky-500 */
  border-color: #38bdf8; /* sky-400 */
}

.custom-checkbox.indeterminate {
  background-color: #0ea5e9; /* sky-500 */
  border-color: #38bdf8; /* sky-400 */
}

.check-icon {
  color: white;
  font-size: 0.75rem; /* 12px */
}
</style>