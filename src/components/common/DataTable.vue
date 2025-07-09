<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm" :style="{ minWidth: minWidth }" :aria-label="ariaLabel">
      <thead class="sticky top-0 bg-slate-900/50 backdrop-blur-sm z-10">
        <tr class="border-b border-slate-700">
          <th v-for="col in columns" :key="col.key" scope="col" class="p-3 font-medium text-slate-300 whitespace-nowrap"
            :class="[
              col.headerClass,
              { 'cursor-pointer hover:text-white': col.sortable }
            ]" @click="col.sortable ? $emit('sort', col.key) : null" :aria-sort="getSortDirection(col.key)">
            <slot :name="`header-${col.key}`" :column="col">
              {{ col.label }}
              <template v-if="col.sortable">
                <span v-if="sortKey === col.key" class="ml-1">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
                <span v-else class="ml-1 text-slate-600">◆</span>
              </template>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody class="text-slate-400">
        <tr v-if="isLoading">
          <td :colspan="columns.length" class="p-8 text-center text-slate-500">
            <div class="flex items-center justify-center text-sky-400">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>正在加载...</span>
            </div>
          </td>
        </tr>
        <tr v-else-if="!items || items.length === 0">
          <td :colspan="columns.length">
            <EmptyState :title="emptyMessage" message="请检查您的筛选条件或等待数据同步。" />
          </td>
        </tr>
        <tr v-else v-for="(item, index) in items" :key="item.id || index"
          class="border-b border-slate-800 hover:bg-sky-500/10 transition-colors">
          <td v-for="col in columns" :key="`${item.id || index}-${col.key}`" class="p-3" :class="col.cellClass">
            <slot :name="`cell-${col.key}`" :item="item" :column="col">
              {{ item[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import EmptyState from './EmptyState.vue';

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  minWidth: {
    type: String,
    default: '600px',
  },
  ariaLabel: {
    type: String,
    default: 'Data table',
  },
  emptyMessage: {
    type: String,
    default: '没有匹配的数据。'
  },
  sortKey: String,
  sortDirection: String,
});

defineEmits(['sort']);

const getSortDirection = (key) => {
  if (props.sortKey !== key) return 'none';
  return props.sortDirection === 'asc' ? 'ascending' : 'descending';
};
</script>