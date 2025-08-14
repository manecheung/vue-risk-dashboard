<template>
  <li class="my-2 list-none">
    <div class="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/80 transition-all duration-200">
      <!-- 左侧内容：展开/折叠图标、名称 -->
      <div class="flex items-center flex-1 min-w-0">
        <button 
          @click="isExpanded = !isExpanded" 
          v-if="hasChildren" 
          class="w-8 h-8 flex-shrink-0 rounded-full hover:bg-slate-600/50 flex items-center justify-center text-slate-400"
        >
          <i :class="['fas fa-chevron-right text-xs transition-transform', { 'rotate-90': isExpanded }]"></i>
        </button>
        <div v-else class="w-8 flex-shrink-0"></div>
        
        <div class="truncate ml-2">
          <span class="font-semibold text-slate-200">{{ node.name }}</span>
          <span class="text-xs text-slate-400 ml-3">(负责人: {{ node.manager || '未指定' }})</span>
        </div>
      </div>
      
      <!-- 右侧操作按钮 -->
      <div class="flex items-center gap-x-2">
        <button 
          @click.stop="$emit('addChild', node)"
          class="px-2 py-1 text-sm text-teal-400 hover:text-teal-300 hover:bg-teal-500/20 rounded transition-colors"
        >
          添加子节点
        </button>
        <button 
          @click.stop="$emit('edit', node)"
          class="px-2 py-1 text-sm text-sky-400 hover:text-sky-300 hover:bg-sky-500/20 rounded transition-colors"
        >
          编辑
        </button>
        <button 
          @click.stop="$emit('delete', node.id)"
          class="px-2 py-1 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
        >
          删除
        </button>
      </div>
    </div>
    
    <!-- 子节点递归渲染 -->
    <ul v-if="hasChildren && isExpanded" class="pl-8 pt-2 border-l-2 border-slate-800 ml-4">
      <OrganizationNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        @edit="(item) => $emit('edit', item)"
        @delete="(id) => $emit('delete', id)"
        @add-child="(item) => $emit('addChild', item)"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue';

// 为递归组件显式命名
defineOptions({
  name: 'OrganizationNode'
});

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit', 'delete', 'addChild']);

const isExpanded = ref(true);
const hasChildren = computed(() => props.node.children && props.node.children.length > 0);
</script>

<style scoped>
/* 如果需要额外的样式支持 */
.btn-action {
  @apply w-8 h-8 rounded-full flex items-center justify-center transition-colors;
}
</style>