<template>
  <main class="flex flex-col p-6" style="height: calc(100vh - 4rem);">
    <header class="flex-shrink-0 mb-4 text-sm text-slate-400" aria-label="面包屑导航">产业链风险预警 / 风险蔓延模拟</header>
    <div class="panel flex-grow min-h-0 relative">
      <div
        class="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-3 border-b border-slate-700">
        <h2 class="text-lg font-bold">风险蔓延模拟 <span v-if="store.isCustomData" class="text-sm text-amber-400"
            title="当前正在使用您导入的数据进行模拟">(使用导入数据)</span></h2>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div class="flex items-center space-x-2 p-1 bg-slate-900/50 rounded-md" role="group" aria-label="模拟播放控制">
            <button @click="store.togglePlay" class="btn btn-primary text-sm"
              :aria-label="store.isPlaying ? '暂停模拟' : '播放模拟'" :title="store.isPlaying ? '暂停模拟' : '播放模拟'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  :d="store.isPlaying ? 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v4a1 1 0 11-2 0V8z' : 'M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.118v3.764a1 1 0 001.555.832l3.198-1.882a1 1 0 000-1.664l-3.198-1.882z'"
                  clip-rule="evenodd" />
              </svg>
              <span class="ml-2">{{ store.isPlaying ? '暂停' : '播放' }}</span>
            </button>
            <button @click="store.reset" class="btn btn-secondary text-sm" aria-label="重置模拟" title="重置模拟为初始状态">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7V9a1 1 0 01-2 0V3a1 1 0 011-1zm12 14a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.001 13v-2a1 1 0 012 0v4a1 1 0 01-1 1z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="flex items-center space-x-2 p-1 bg-slate-900/50 rounded-md" role="group" aria-label="单步控制">
            <button @click="store.prevStep" :disabled="store.currentStep === 0" class="btn btn-secondary text-sm"
              title="后退一步">上一步</button>
            <button @click="store.nextStep"
              :disabled="!store.graphData.riskPath || store.currentStep >= store.graphData.riskPath.length"
              class="btn btn-secondary text-sm" title="前进一步">下一步</button>
          </div>
          <div class="flex items-center space-x-2 p-1 bg-slate-900/50 rounded-md" role="group" aria-label="数据操作">
            <button @click="triggerImport" class="btn btn-primary text-sm" title="导入自定义的CSV文件来定义模拟场景"><svg
                xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L13 9.414V13H5.5z" />
                <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
              </svg><span class="ml-2">导入</span></button>
            <input type="file" ref="fileInput" @change="store.handleFileUpload" accept=".csv" class="hidden"
              aria-hidden="true">
            <button @click="store.saveImportData" class="btn btn-secondary text-sm" title="保存导入的数据">保存导入数据</button>
            <button @click="store.clearImportData" class="btn btn-danger text-sm" title="清除导入的数据">清除导入数据</button>
            <button @click="store.downloadTemplate" class="btn btn-secondary text-sm"
              title="下载定义模拟场景的CSV模板文件">模板</button>
            <button @click="store.exportData" class="btn btn-secondary text-sm" title="将当前模拟的状态导出为CSV文件">导出</button>
          </div>
        </div>
      </div>
      <div ref="containerRef" class="flex-grow min-h-0 p-1"></div>
    </div>
  </main>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useChainRiskStore } from '@/stores/chainRiskStore';
import { useChainRiskGraph } from '@/composables/useChainRiskGraph';

const store = useChainRiskStore();
const fileInput = ref(null);

const { containerRef } = useChainRiskGraph(store);

const triggerImport = () => {
  fileInput.value?.click();
};

onUnmounted(() => {
  store.pause();
});
</script>