<template>
  <li class="list-none my-1">
    <div class="flex items-center p-2 rounded-md hover:bg-slate-700/50 transition-colors duration-150">
      <button v-if="hasChildren" @click="toggleExpand" class="w-7 h-7 flex-shrink-0 rounded-full hover:bg-slate-600/50 flex items-center justify-center text-slate-400 mr-1">
        <i :class="['fas fa-chevron-right text-xs transition-transform', { 'rotate-90': isExpanded }]"></i>
      </button>
      <div v-else class="w-7 mr-1 flex-shrink-0"></div>

      <label :for="node.key" class="flex items-center cursor-pointer flex-grow">
        <input
          type="checkbox"
          :id="node.key"
          :checked="isSelected"
          @change="toggleSelection"
          class="hidden"
        />
        <span :class="['w-5 h-5 rounded-md border-2 flex-shrink-0 transition-all duration-200 flex items-center justify-center', isSelected ? 'bg-sky-500 border-sky-400' : 'bg-slate-700 border-slate-600 hover:border-slate-500']">
          <i v-if="isSelected" class="fas fa-check text-white text-xs transition-transform duration-200 scale-100"></i>
        </span>
        <span class="ml-3 text-slate-300">{{ node.title }}</span>
      </label>
    </div>

    <ul v-if="hasChildren && isExpanded" class="pl-10 mt-1 pt-1 border-l-2 border-slate-800">
      <PermissionNode
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :selected-keys="selectedKeys"
        @update:selected-keys="updateChildKeys"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  node: Object,
  selectedKeys: Set,
});

const emit = defineEmits(['update:selected-keys']);

const isExpanded = ref(true);

const hasChildren = computed(() => props.node.children && props.node.children.length > 0);
const isSelected = computed(() => props.selectedKeys.has(props.node.key));

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const toggleSelection = () => {
  const newSelectedKeys = new Set(props.selectedKeys);
  if (isSelected.value) {
    // If currently selected, deselect this node and all its children
    deselectNodeAndChildren(props.node, newSelectedKeys);
  } else {
    // If not selected, select this node and all its children
    selectNodeAndChildren(props.node, newSelectedKeys);
  }
  emit('update:selected-keys', newSelectedKeys);
};

const updateChildKeys = (newChildKeys) => {
  const newSelectedKeys = new Set(newChildKeys);
  // Check if this node should be selected or deselected based on children
  if (hasChildren.value) {
    const allChildrenSelected = props.node.children.every(child => newSelectedKeys.has(child.key));
    if (allChildrenSelected) {
      newSelectedKeys.add(props.node.key);
    } else {
      newSelectedKeys.delete(props.node.key);
    }
  }
  emit('update:selected-keys', newSelectedKeys);
}

// Helper function to recursively select a node and its children
function selectNodeAndChildren(node, selectedKeys) {
  selectedKeys.add(node.key);
  if (node.children) {
    node.children.forEach(child => selectNodeAndChildren(child, selectedKeys));
  }
}

// Helper function to recursively deselect a node and its children
function deselectNodeAndChildren(node, selectedKeys) {
  selectedKeys.delete(node.key);
  if (node.children) {
    node.children.forEach(child => deselectNodeAndChildren(child, selectedKeys));
  }
}

</script>

<script>
// To handle recursive component naming
export default {
  name: 'PermissionNode'
}
</script>