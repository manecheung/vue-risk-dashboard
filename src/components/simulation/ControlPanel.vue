<template>
  <div class="flex flex-col h-full">
    <h2 class="panel-title flex-shrink-0">模拟控制</h2>
    <div class="p-4 space-y-6 overflow-y-auto custom-scrollbar">
      <!-- 场景选择 -->
      <div class="space-y-2">
        <label for="simulation-select" class="block text-sm font-medium text-slate-400">选择模拟场景</label>
        <CustomSelect
          id="simulation-select"
          v-model="selectedSimulation"
          :options="store.simulationOptions"
          placeholder="请选择场景..."
          :disabled="store.isLoading"
        />
        <!-- to do: 场景新增和删除场景默认隐藏，后续需要优化后端的性能 -->
        <div class="flex space-x-2 mt-2 hidden">
          <button @click="showAddModal = true" class="btn btn-primary w-full">新增场景</button>
          <button @click="confirmDelete" class="btn btn-danger w-full" :disabled="!store.selectedSimulationId || store.isAnimating">删除场景</button>
        </div>
      </div>

      <!-- 时间轴 -->
      <div class="space-y-2">
        <label for="time-slider" class="block text-sm font-medium text-slate-400">
          时间步长: <span class="font-bold text-cyan-400">{{ store.currentTime }}</span>
        </label>
        <input
          id="time-slider"
          type="range"
          :min="store.timeRange.min"
          :max="store.timeRange.max"
          :value="store.currentTime"
          @input="onTimeSliderChange"
          class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
          :disabled="!store.selectedSimulationId || store.isAnimating"
        />
        <div class="flex justify-between text-xs text-slate-500">
          <span>{{ store.timeRange.min }}</span>
          <span>{{ store.timeRange.max }}</span>
        </div>
      </div>

      <!-- 播放控制 -->
      <div class="space-y-3">
        <label class="block text-sm font-medium text-slate-400">播放控制</label>
        <div class="grid grid-cols-2 gap-2">
          <button @click="togglePlay" class="btn btn-secondary" :disabled="!store.selectedSimulationId || store.isAnimating">
            <span v-if="!isPlaying">▶️ 自动播放</span>
            <span v-else>⏸️ 暂停</span>
          </button>
          <button @click="reset" class="btn btn-secondary" :disabled="!store.selectedSimulationId || store.isAnimating">🔄 重置</button>
          <button @click="prevStep" class="btn btn-secondary" :disabled="!store.selectedSimulationId || store.isAnimating">⏪ 上一步</button>
          <button @click="nextStep" class="btn btn-secondary" :disabled="!store.selectedSimulationId || store.isAnimating">⏩ 下一步</button>
        </div>
      </div>

      <div v-if="store.isLoading && !store.selectedSimulationId" class="text-sm text-slate-400">正在加载场景列表...</div>
      <div v-if="store.error" class="text-sm text-red-400">错误: {{ store.error }}</div>
    </div>
    <FormModal
      v-if="showAddModal"
      :is-open="showAddModal"
      :form-config="simulationFormConfig"
      modal-title="新增模拟场景"
      :is-loading="isCreating"
      @close="showAddModal = false"
      @submit="handleCreateSimulation"
    />
    <ConfirmModal
      :is-open="isConfirmModalOpen"
      title="确认删除"
      message="您确定要删除此模拟场景吗？此操作无法撤销。"
      @confirm="handleDelete"
      @cancel="isConfirmModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useSimulationStore } from '@/stores/simulationStore';
import { debounce } from 'lodash';
import CustomSelect from '@/components/common/CustomSelect.vue';
import FormModal from '../common/FormModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';

const store = useSimulationStore();
const isPlaying = ref(false);
const showAddModal = ref(false);
const isConfirmModalOpen = ref(false);
const isCreating = ref(false);
let playInterval = null;

// Computed property to sync v-model with Pinia state
const selectedSimulation = computed({
  get: () => store.selectedSimulationId,
  set: (newId) => {
    if (newId) {
      stop();
      store.selectSimulation(parseInt(newId, 10));
    }
  }
});

// Debounce the time change to avoid excessive API calls while dragging
const debouncedSetTime = debounce((time) => {
  store.setCurrentTime(time);
}, 200);

const onTimeSliderChange = (event) => {
  const time = parseInt(event.target.value, 10);
  debouncedSetTime(time);
};

const play = () => {
  // 如果当前正在播放动画，则不允许启动新的播放进程
  if (store.isAnimating) return;

  // 如果已在结尾，则重置到开头
  if (store.currentTime >= store.timeRange.max) {
    store.setCurrentTime(store.timeRange.min);
  }

  isPlaying.value = true;

  // 设置定时器，该定时器的工作是检查是否可以进入下一步
  playInterval = setInterval(() => {
    // 仅当上一步动画完成时才推进
    if (!store.isAnimating) {
      if (store.currentTime < store.timeRange.max) {
        store.setCurrentTime(store.currentTime + 1);
      } else {
        stop(); // 到达结尾，停止播放
      }
    }
  }, 200); // 每200毫秒检查一次状态
};

const stop = () => {
  isPlaying.value = false;
  clearInterval(playInterval);
  playInterval = null;
};

const togglePlay = () => {
  if (isPlaying.value) {
    stop();
  } else {
    play();
  }
};

const reset = () => {
  stop();
  store.setCurrentTime(store.timeRange.min);
};

const prevStep = () => {
  stop();
  store.setCurrentTime(store.currentTime - 1);
};

const nextStep = () => {
  stop();
  store.setCurrentTime(store.currentTime + 1);
};

onUnmounted(() => {
  stop(); // Clean up interval on component unmount
});

const confirmDelete = () => {
  isConfirmModalOpen.value = true;
};

const handleDelete = () => {
  if (store.selectedSimulationId) {
    store.deleteSimulation(store.selectedSimulationId);
  }
  isConfirmModalOpen.value = false;
};

const simulationFormConfig = {
  fields: [
    { name: 'name', label: '场景名称', type: 'text', required: true },
    { name: 'description', label: '场景描述', type: 'textarea' },
    { name: 'file', label: '场景文件', type: 'file', required: true },
  ]
};

const handleCreateSimulation = async (formData) => {
  if (!formData.file) {
    alert('请选择一个文件');
    return;
  }

  const data = new FormData();
  data.append('name', formData.name);
  data.append('description', formData.description || '');
  data.append('file', formData.file);

  isCreating.value = true;
  try {
    await store.createSimulation(data);
    showAddModal.value = false;
  } catch (error) {
    console.error('Failed to create simulation', error);
    alert('创建失败: ' + error.message);
  } finally {
    isCreating.value = false;
  }
};

</script>

<style scoped>
.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #1e293b; /* slate-800 */
  color: #e2e8f0; /* slate-200 */
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; border-radius: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
</style>
