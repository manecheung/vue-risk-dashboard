<template>
  <div class="p-4 lg:p-6 space-y-4 lg:space-y-6 flex flex-col" style="height: calc(100vh - 4rem);">
    <!-- Control Panel -->
    <div class="panel flex-shrink-0">
        <div class="p-3 border-b border-slate-800">
             <h1 class="text-lg font-bold">原材料价格监测与预测</h1>
        </div>
        <div class="p-3">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div class="md:col-span-2">
                <label for="indicator-select" class="block text-sm font-medium text-slate-400 mb-1">选择指标 (预测功能仅支持单选)</label>
                <CustomSelect
                    :options="indicatorOptions"
                    v-model="selectedIndicators"
                    multiple
                    placeholder="请选择要查询的原材料指标"
                />
                </div>

                <div>
                <label for="date-range" class="block text-sm font-medium text-slate-400 mb-1">选择日期范围</label>
                <div class="flex items-center space-x-2">
                    <input type="date" v-model="dateRange.start" class="form-input w-full" style="color-scheme: dark;"/>
                    <span class="text-slate-500">-</span>
                    <input type="date" v-model="dateRange.end" class="form-input w-full" style="color-scheme: dark;"/>
                </div>
                </div>
            </div>
            <div class="mt-4 flex justify-end space-x-3">
                <button
                  @click="handleQuery"
                  class="btn btn-secondary"
                  :disabled="store.isLoading || selectedIndicators.length === 0"
                >
                  <span v-if="store.isLoading">查询中...</span>
                  <span v-else>查询价格</span>
                </button>
                <button
                  @click="handlePrediction"
                  class="btn btn-primary"
                  :disabled="predictButtonDisabled"
                  title="预测功能仅在选择单个指标后可用"
                >
                  <span v-if="store.isPredicting">预测中...</span>
                  <span v-else>预测未来7天</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Chart -->
    <div class="panel flex-1 flex flex-col min-h-0">
        <h2 class="panel-title">价格走势图</h2>
        <div class="flex-grow p-2 min-h-0">
            <PriceChart :chart-data="chartData" v-if="!store.isLoading && chartData.labels && chartData.labels.length > 0"/>
            <div v-else class="w-full h-full flex items-center justify-center text-slate-500">
                <p v-if="store.isLoading">正在加载图表数据...</p>
                <p v-else>请选择指标和日期范围后点击查询。</p>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMaterialPriceStore } from '@/stores/materialPriceStore';
import CustomSelect from '@/components/common/CustomSelect.vue';
import PriceChart from '@/components/materials/PriceChart.vue';

const store = useMaterialPriceStore();

const selectedIndicators = ref([]);
const dateRange = ref({
  start: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split('T')[0], // Default to 2 years for better prediction base
  end: new Date().toISOString().split('T')[0],
});

const indicatorOptions = computed(() =>
  store.indicators.map(i => ({ value: i.id, label: i.quotaName }))
);

const chartData = computed(() => store.chartData);

const predictButtonDisabled = computed(() => {
    return store.isPredicting || selectedIndicators.value.length !== 1 || !store.priceData.labels || store.priceData.labels.length === 0;
});

onMounted(() => {
  if (store.indicators.length === 0) {
      store.fetchIndicators();
  }
});

const handleQuery = () => {
  store.fetchPriceData(selectedIndicators.value, dateRange.value.start, dateRange.value.end);
};

const handlePrediction = () => {
    if (predictButtonDisabled.value) return;

    // 首先，重新查询历史数据以确保图表显示的是最新历史数据
    handleQuery();

    const indicatorId = selectedIndicators.value[0];
    const indicator = store.indicators.find(i => i.id === indicatorId);
    if (indicator) {
        store.fetchPrediction(indicatorId, indicator.quotaName);
    }
};

</script>
