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
          :disabled="!store.selectedSimulationId"
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
          <button @click="togglePlay" class="control-btn" :disabled="!store.selectedSimulationId">
            <span v-if="!isPlaying">▶️ 自动播放</span>
            <span v-else>⏸️ 暂停</span>
          </button>
          <button @click="reset" class="control-btn" :disabled="!store.selectedSimulationId">🔄 重置</button>
          <button @click="prevStep" class="control-btn" :disabled="!store.selectedSimulationId">⏪ 上一步</button>
          <button @click="nextStep" class="control-btn" :disabled="!store.selectedSimulationId">⏩ 下一步</button>
        </div>
      </div>

      <div v-if="store.isLoading && !store.selectedSimulationId" class="text-sm text-slate-400">正在加载场景列表...</div>
      <div v-if="store.error" class="text-sm text-red-400">错误: {{ store.error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useSimulationStore } from '@/stores/simulationStore';
import { debounce } from 'lodash';
import CustomSelect from '@/components/common/CustomSelect.vue';

const store = useSimulationStore();
const isPlaying = ref(false);
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
  if (store.currentTime >= store.timeRange.max) {
    store.setCurrentTime(store.timeRange.min); // Loop back to start if at the end
  }
  isPlaying.value = true;
  playInterval = setInterval(() => {
    if (store.currentTime < store.timeRange.max) {
      store.setCurrentTime(store.currentTime + 1);
    } else {
      stop(); // Stop when it reaches the end
    }
  }, 1000);
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

</script>

<style scoped>
.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #1e293b; /* slate-800 */
  color: #e2e8f0; /* slate-200 */
}

.control-btn {
  padding: 0.5rem;
  background-color: #334155;
  color: #e2e8f0;
  border: 1px solid #475569;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.control-btn:hover:not(:disabled) {
  background-color: #475569;
}
.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; border-radius: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
</style>
