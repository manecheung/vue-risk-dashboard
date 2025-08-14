<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div class="panel w-full max-w-md">
      <h3 class="p-4 border-b border-slate-700 font-bold">执行风险蔓延模拟</h3>
      <div class="p-4 space-y-4">
        <p class="text-sm text-slate-400">请选择一个风险源头节点开始模拟。</p>
        <div>
          <label for="startNode" class="text-sm">风险源节点</label>
          <select v-model="selectedNode" id="startNode" class="form-input w-full text-sm mt-1">
            <option disabled value="">请选择一个节点</option>
            <option v-for="node in nodes" :key="node.id" :value="node.id">
              {{ node.label }} (ID: {{ node.id }})
            </option>
          </select>
        </div>
      </div>
      <div class="p-4 border-t border-slate-700 flex justify-end gap-4">
        <button @click="$emit('close')" class="btn btn-secondary">取消</button>
        <button @click="handleRun" :disabled="!selectedNode" class="btn btn-primary">开始执行</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  nodes: { type: Array, default: () => [] },
});

const emit = defineEmits(['close', 'run']);

const selectedNode = ref('');

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    selectedNode.value = '';
  }
});

function handleRun() {
  if (selectedNode.value) {
    emit('run', selectedNode.value);
  }
}
</script>
