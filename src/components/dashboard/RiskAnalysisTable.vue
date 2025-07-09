<template>
  <div class="p-4">
    <table class="w-full text-xs" style="min-width: 450px;">
      <thead>
        <tr class="text-left border-b border-slate-700">
          <th scope="col" class="p-2 whitespace-nowrap">企业名称</th>
          <th scope="col" class="p-2">风险</th>
          <th scope="col" class="p-2 whitespace-nowrap">风险简析</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!data || data.length === 0">
          <td colspan="3" class="text-center p-4 text-slate-500">暂无数据</td>
        </tr>
        <tr v-else v-for="item in data" :key="item.name"
          class="border-b border-slate-800 hover:bg-sky-500/10 transition-colors">
          <td class="p-2 text-slate-300 whitespace-nowrap">{{ item.name }}</td>
          <td class="p-2">
            <span class="font-bold px-2 py-1 rounded" :class="getRiskStyling(item.level).bg">{{ item.level }}</span>
          </td>
          <td class="p-2 text-slate-400 whitespace-nowrap">{{ item.reason }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { getRiskStyling } from '@/utils/helpers';

defineProps({
  data: {
    type: Array,
    required: true
  }
});
</script>