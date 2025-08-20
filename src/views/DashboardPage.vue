<template>
  <div class="p-4 lg:p-6 space-y-4 lg:space-y-6">
    <header class="dashboard-header" role="banner">
      <div class="corner-decorator top-left"></div>
      <div class="corner-decorator top-right"></div>
      <h1 class="header-title">风电产业链风险预警数据中心</h1>
      <div class="scan-light"></div>
      <div class="bottom-line"></div>
      <div class="corner-decorator bottom-left"></div>
      <div class="corner-decorator bottom-right"></div>
    </header>

    <KeyMetrics :metrics="store.keyMetrics" />

    <main class="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6" style="height: calc(100vh - 14rem);">
      <section class="lg:col-span-1 grid grid-rows-2 gap-4 lg:gap-6 overflow-hidden"
        aria-labelledby="risk-overview-title">
        <div class="panel flex-1">
          <h2 id="risk-overview-title" class="panel-title">企业风险情况概览</h2>
          <div class="flex-grow p-2 min-h-0">
            <RiskPieChart :data="store.riskDistribution" />
          </div>
        </div>
        <div class="panel flex-1 flex flex-col overflow-hidden">
          <h2 id="risk-analysis-title" class="panel-title">企业风险情况解析</h2>
          <div class="flex-grow min-h-0 overflow-auto custom-scrollbar">
            <RiskAnalysisTable :data="store.riskAnalysis.records" />
          </div>
        </div>
      </section>

      <section class="lg:col-span-2 panel flex flex-col" aria-labelledby="main-graph-title">
        <div class="flex-shrink-0 flex flex-wrap justify-between items-center gap-2 p-3 border-b border-slate-800">
          <h2 id="main-graph-title" class="text-lg font-bold">产业链知识图谱与企业概览</h2>
          <div class="flex items-center space-x-2" role="tablist" aria-label="视图切换">
            <button @click="store.setActiveView('graph')"
              :class="store.activeView === 'graph' ? 'btn-primary' : 'btn-secondary'" class="btn text-sm" role="tab"
              :aria-selected="store.activeView === 'graph'">知识图谱</button>
            <button @click="store.setActiveView('map')"
              :class="store.activeView === 'map' ? 'btn-primary' : 'btn-secondary'" class="btn text-sm" role="tab"
              :aria-selected="store.activeView === 'map'">全国地图</button>
          </div>
        </div>

        <div v-if="store.activeView === 'graph'"
          class="flex-shrink-0 flex flex-wrap items-center justify-between gap-y-2 p-2 border-b border-slate-800 bg-slate-900/20 text-sm">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <p class="text-slate-400" id="relation-filter-label">关系:</p>
              <div class="flex items-center space-x-3" role="group" aria-labelledby="relation-filter-label">
                <label class="flex items-center cursor-pointer"><input type="checkbox"
                    v-model="store.graphOptions.filters.supplier" class="form-checkbox mr-1">竞争</label>
                <!-- <label class="flex items-center cursor-pointer"><input type="checkbox"
                    v-model="store.graphOptions.filters.customer" class="form-checkbox mr-1">销售</label> -->
                <label class="flex items-center cursor-pointer"><input type="checkbox"
                    v-model="store.graphOptions.filters.partner" class="form-checkbox mr-1">合作</label>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <input type="text" v-model="store.graphOptions.searchTerm" @keydown.enter="executeSearch" class="form-input p-1 text-xs w-36"
              placeholder="搜索企业名称...">
            <button @click="executeSearch" class="btn btn-primary text-xs px-2 py-1">搜索</button>
            <button @click="resetGraph" class="btn btn-secondary text-xs px-2 py-1">重置</button>
          </div>
        </div>

        <div class="flex-grow p-1 min-h-0 relative">
          <KnowledgeGraph v-if="store.activeView === 'graph'" ref="knowledgeGraphRef"
            :data="store.knowledgeGraph" :options="store.graphOptions" :reset-signal="resetSignal"
            @search-results="handleSearchResults" @search-cleared="handleSearchCleared"
            @graph-mounted="handleGraphMounted" @node-click="handleNodeClick" />
          <ChinaMap v-if="store.activeView === 'map'" :data="store.riskMap" />

          <div v-if="showNoResults"
            class="absolute inset-0 flex items-center justify-center bg-slate-900/50 text-slate-400 text-lg rounded-b-xl pointer-events-none">
            未找到相关的企业节点
          </div>

          <div v-if="store.activeView === 'graph' && knowledgeGraphRef?.legendData"
            class="absolute bottom-2 right-3 text-xs space-y-1 bg-slate-900/80 p-2 rounded-md border border-slate-700 pointer-events-none">
            <div v-for="(color, type) in knowledgeGraphRef.legendData" :key="type" class="flex items-center">
              <span class="w-4 h-0.5 mr-2 rounded-full" :style="{ backgroundColor: color }"></span>
              <span>{{ relationTypeToLabel(type) }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="lg:col-span-1 space-y-4 lg:space-y-6 flex flex-col" aria-labelledby="industry-analysis-title">
        <div class="panel flex-1">
          <h2 id="industry-analysis-title" class="panel-title">产业链企业健康指数</h2>
          <HealthBarChart :data="store.industryHealth" />
        </div>
        <div class="panel flex-1">
          <h2 class="panel-title">供应链企业风险评估</h2>
          <RiskRadarChart :data="store.supplyChainRisk" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import KeyMetrics from '@/components/dashboard/KeyMetrics.vue';
import RiskPieChart from '@/components/dashboard/RiskPieChart.vue';
import RiskAnalysisTable from '@/components/dashboard/RiskAnalysisTable.vue';
import KnowledgeGraph from '@/components/dashboard/KnowledgeGraph.vue';
import ChinaMap from '@/components/dashboard/ChinaMap.vue';
import HealthBarChart from '@/components/dashboard/HealthBarChart.vue';
import RiskRadarChart from '@/components/dashboard/RiskRadarChart.vue';
import CustomSelect from '@/components/common/CustomSelect.vue';

const store = useDashboardStore();
const resetSignal = ref(0);
const searchHasResults = ref(true);
const isGraphReady = ref(false);

// 修改点 3: 创建 ref 来引用 KnowledgeGraph 组件实例
const knowledgeGraphRef = ref(null);

// 修改点 4: 增加一个辅助函数，用于将关系类型(英文)映射为显示标签(中文)
const relationTypeToLabel = (type) => {
  const map = {
    supplier: '竞争',
    // customer: '销售',
    partner: '合作',
  };
  return map[type] || type;
};

const showNoResults = computed(() => {
  return isGraphReady.value && store.graphOptions.searchTerm && !searchHasResults.value;
});

const executeSearch = () => {
  // 如果搜索词为空，则设置为默认值
  if (!store.graphOptions.searchTerm || store.graphOptions.searchTerm.trim() === '') {
    store.graphOptions.searchTerm = '东方电气';
  }
  // 调用 store action 执行搜索
  store.fetchGraphData({ keyword: store.graphOptions.searchTerm });
};

const resetGraph = () => {
  store.resetGraphOptions();
  resetSignal.value++;
  searchHasResults.value = true;
  // 重置后也立即获取默认图谱
  store.fetchGraphData({ keyword: store.graphOptions.searchTerm });
};

const handleSearchResults = (count) => {
  searchHasResults.value = count > 0;
};

const handleSearchCleared = () => {
  if (store.graphOptions.searchTerm) {
    store.graphOptions.searchTerm = '';
  }
  searchHasResults.value = true;
};

const handleGraphMounted = () => {
  isGraphReady.value = true;
};

const handleNodeClick = (companyId) => {
  store.fetchGraphData({ companyId });
};

onMounted(() => {
  store.fetchAllDashboardData();
});
</script>