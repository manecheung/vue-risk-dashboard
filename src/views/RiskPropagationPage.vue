<template>
  <div class="p-4 lg:p-6 space-y-4 lg:space-y-6">
    <header class="dashboard-header" role="banner">
      <div class="corner-decorator top-left"></div>
      <div class="corner-decorator top-right"></div>
      <h1 class="header-title">全球风电整机产业链风险蔓延模拟</h1>
      <div class="scan-light"></div>
      <div class="bottom-line"></div>
      <div class="corner-decorator bottom-left"></div>
      <div class="corner-decorator bottom-right"></div>
    </header>

    <main class="space-y-4 lg:space-y-6">
      <!-- Simulation Form -->
      <div class="panel">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4">
          <div class="md:col-span-2">
            <label for="initial_abnormal_node" class="block text-base font-medium text-slate-300 mb-2">设定产业链危机源头国家:</label>
            <select id="initial_abnormal_node" v-model="selectedNode" class="form-input w-full">
              <option v-for="country in countries" :key="country.value" :value="country.value">{{ country.name }}</option>
            </select>
          </div>
          <button @click="startSimulation" :disabled="isLoading" class="btn btn-primary w-full text-base py-2.5">
            {{ isLoading ? '模拟中...' : '开始模拟' }}
          </button>
        </div>
      </div>

      <!-- Simulation Controls and Display -->
      <div class="panel">
        <div class="flex flex-col sm:flex-row justify-between items-center p-3 border-b border-slate-800">
          <div class="flex items-center space-x-2 mb-4 sm:mb-0">
            <button @click="togglePlay" :disabled="!simulationData.log.length" class="btn btn-secondary">{{ isPlaying ? '暂停' : '播放' }}</button>
            <button @click="prevStep" :disabled="!simulationData.log.length" class="btn btn-secondary">上一步</button>
            <button @click="nextStep" :disabled="!simulationData.log.length" class="btn btn-secondary">下一步</button>
          </div>
          <div id="step-info" class="text-lg font-semibold text-slate-300">
            蔓延进程: {{ currentStep }} / {{ totalSteps }}
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4" style="height: 600px;">
          <div ref="graphContainer" class="lg:col-span-2 w-full h-full bg-slate-900/50 border border-slate-800 rounded-md"></div>
          <div class="w-full h-full bg-slate-900/50 border border-slate-800 rounded-md p-4 overflow-y-auto custom-scrollbar">
            <h2 class="panel-title !text-xl !pb-2">风险预警</h2>
            <div v-if="simulationStarted && stagedAlerts.length === 0" class="text-slate-500">
              模拟完成，未发现风险蔓延。
            </div>
            <ul v-else id="alert-list" class="space-y-4">
              <li v-for="stage in stagedAlerts" :key="stage.step">
                <h3 class="text-base font-semibold text-slate-300 mb-2">阶段 {{ stage.step }}</h3>
                <ul class="space-y-2 pl-4 border-l border-slate-700">
                  <li v-for="alert in stage.alerts" :key="alert.country" class="text-sm">
                    <span class="font-semibold text-red-500">⚠️ {{ alert.country }}:</span>
                    <span class="text-slate-400 ml-2">{{ alert.reason }}</span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { runChainRiskSimulation } from '@/services/api';

const graphContainer = ref(null);
const isLoading = ref(false);
const simulationStarted = ref(false);

const selectedNode = ref('乌克兰');
const countries = ref([
    { value: '乌克兰', name: '乌克兰' }, { value: '加拿大', name: '加拿大' },
    { value: '西班牙', name: '西班牙' }, { value: '智利', name: '智利' },
    { value: '越南', name: '越南' }, { value: '德国', name: '德国' },
    { value: '丹麦', name: '丹麦' }, { value: '美国', name: '美国' },
    { value: '中国', name: '中国' }, { value: '英国', name: '英国' },
    { value: '荷兰', name: '荷兰' }, { value: '比利时', name: '比利时' },
    { value: '挪威', name: '挪威' }, { value: '土耳其', name: '土耳其' },
    { value: '其他亚洲国家', name: '其他亚洲国家' }, { value: '法国', name: '法国' },
    { value: '瑞典', name: '瑞典' }, { value: '波兰', name: '波兰' },
    { value: '日本', name: '日本' }, { value: '南非', name: '南非' },
    { value: '墨西哥', name: '墨西哥' }, { value: '澳大利亚', name: '澳大利亚' },
    { value: '希腊', name: '希腊' }, { value: '其他国家', name: '其他国家' }
]);

const countryNameToValue = {
    'Ukraine': '乌克兰', 'Canada': '加拿大', 'Spain': '西班牙', 'Chile': '智利',
    'Viet Nam': '越南', 'Germany': '德国', 'Denmark': '丹麦', 'USA': '美国',
    'China': '中国', 'United Kingdom': '英国', 'Netherlands': '荷兰',
    'Belgium': '比利时', 'Norway': '挪威', 'Türkiye': '土耳其',
    'Other Asia, nes': '其他亚洲国家', 'France': '法国', 'Sweden': '瑞典',
    'Poland': '波兰', 'Japan': '日本', 'South Africa': '南非',
    'Mexico': '墨西哥', 'Australia': '澳大利亚', 'Greece': '希腊', 'Others': '其他国家'
};

const simulationData = ref({ log: [] });
const currentStep = ref(0);
const isPlaying = ref(false);
let playInterval = null;

const totalSteps = computed(() => simulationData.value.log.length > 0 ? simulationData.value.log.length - 1 : 0);

const stagedAlerts = computed(() => {
  const log = simulationData.value.log;
  if (!log || log.length === 0) {
    return [];
  }

  const allStages = [];

  for (const stepLog of log) {
    const reasons = stepLog.reasons;
    const reasonKeys = Object.keys(reasons);

    if (reasonKeys.length > 0) {
      const stageAlerts = reasonKeys.map(countryKey => ({
        country: countryNameToValue[countryKey] || countryKey,
        reason: reasons[countryKey]
      }));
      
      allStages.push({
        step: stepLog.step,
        alerts: stageAlerts
      });
    }
  }

  return allStages;
});

let svg, projection, pathGenerator;

const countryCoordinates = {
    "乌克兰": [31.1656, 48.3794], "加拿大": [-102.137, 61.0687], "西班牙": [-3.7492, 40.4637],
    "德国": [10.4515, 51.1657], "丹麦": [9.5018, 55.6702], "美国": [-98.5795, 39.8283],
    "中国": [104.9903, 35.0104], "英国": [-2.2426, 53.8038], "荷兰": [5.2913, 52.1533],
    "比利时": [4.4697, 50.6403], "挪威": [8.4689, 63.4457], "土耳其": [35.2433, 39.1813],
    "法国": [2.2137, 46.2276], "瑞典": [14.6447, 60.1282], "波兰": [19.1494, 51.9194],
    "日本": [138.2529, 36.2048], "南非": [22.9375, -30.5595], "墨西哥": [-102.5321, 23.6345],
    "澳大利亚": [133.7751, -25.2744], "智利": [-71.5430, -35.6751], "越南": [108.2772, 14.0583],
    "其他亚洲国家": [101.9758, 4.2105], "其他国家": [105.3188, 61.5240], "希腊": [21.8243, 39.0742]
};

function getCoordinates(countryName) {
    return countryCoordinates[countryName] || [0, 0];
}

function initializeMap() {
    if (!graphContainer.value) return;
    const width = graphContainer.value.clientWidth;
    const height = graphContainer.value.clientHeight;

    d3.select(graphContainer.value).select("svg").remove();
    svg = d3.select(graphContainer.value).append('svg').attr('width', '100%').attr('height', '100%');

    svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "transparent");

    projection = d3.geoMercator().scale(150).translate([width / 2, height / 1.5]);
    pathGenerator = d3.geoPath().projection(projection);

    d3.json("/data/countries-110m.json").then(world => {
        const countries = topojson.feature(world, world.objects.countries);
        svg.append("g").selectAll("path").data(countries.features)
            .enter().append("path")
            .attr("fill", "#334155")
            .attr("stroke", "#1e293b")
            .attr("stroke-width", 0.5)
            .attr("d", pathGenerator)
            .append("title").text(d => d.properties.name);
    });
}

function displayGraph(stepLog) {
    if (!svg || !stepLog) return;

    svg.selectAll(".node, .link, .node-label").remove();

    const nodeSet = new Set();
    stepLog.links.forEach(link => {
        nodeSet.add(link.source);
        nodeSet.add(link.target);
    });

    const nodes = Array.from(nodeSet).map(id => ({
        id: countryNameToValue[id] || id,
        group: stepLog.states[id] === "异常" ? 1 : 0,
        ...getCoordinates(countryNameToValue[id] || id)
    }));

    const nodeLocations = nodes.map(node => ({
        ...node,
        x: projection([node[0], node[1]])[0],
        y: projection([node[0], node[1]])[1]
    }));

    svg.append("g").selectAll("line.link").data(stepLog.links)
        .enter().append("line").attr("class", "link")
        .attr("x1", d => projection(getCoordinates(countryNameToValue[d.source] || d.source))[0])
        .attr("y1", d => projection(getCoordinates(countryNameToValue[d.source] || d.source))[1])
        .attr("x2", d => projection(getCoordinates(countryNameToValue[d.target] || d.target))[0])
        .attr("y2", d => projection(getCoordinates(countryNameToValue[d.target] || d.target))[1])
        .attr("stroke", "#64748b").attr("stroke-opacity", 0.6);

    const nodeGroup = svg.append("g").selectAll("g.node-group").data(nodeLocations)
      .enter().append("g").attr("class", "node-group");

    nodeGroup.append("circle").attr("class", "node")
        .attr("cx", d => d.x).attr("cy", d => d.y)
        .attr("r", 8)
        .style("fill", d => d.group === 1 ? '#ef4444' : '#22c55e')
        .attr("stroke", "#f1f5f9").attr("stroke-width", 1.5)
        .append("title").text(d => d.id);

    nodeGroup.append("text").attr("class", "node-label")
        .attr("x", d => d.x).attr("y", d => d.y - 12)
        .attr("text-anchor", "middle").attr("fill", "#cbd5e1").style("font-size", "10px")
        .text(d => d.id);
}

async function startSimulation() {
    isLoading.value = true;
    simulationStarted.value = false;
    try {
        const valueToFind = Object.keys(countryNameToValue).find(key => countryNameToValue[key] === selectedNode.value);
        const data = await runChainRiskSimulation(valueToFind);
        simulationData.value = data;
        currentStep.value = 0;
        if (data.log && data.log.length > 0) {
            displayGraph(data.log[0]);
        }
    } catch (error) {
        console.error("Simulation failed:", error);
        alert(`模拟失败: ${error.message}`);
    } finally {
        isLoading.value = false;
        simulationStarted.value = true;
    }
}

function updateStep(step) {
    if (step >= 0 && step < simulationData.value.log.length) {
        currentStep.value = step;
        displayGraph(simulationData.value.log[step]);
    }
}

function nextStep() {
    if (currentStep.value < totalSteps.value) {
        updateStep(currentStep.value + 1);
    }
}

function prevStep() {
    if (currentStep.value > 0) {
        updateStep(currentStep.value - 1);
    }
}

function togglePlay() {
    if (isPlaying.value) {
        clearInterval(playInterval);
    } else {
        if (currentStep.value >= totalSteps.value) {
            currentStep.value = 0; // Restart if at the end
        }
        playInterval = setInterval(() => {
            if (currentStep.value < totalSteps.value) {
                nextStep();
            } else {
                clearInterval(playInterval);
                isPlaying.value = false;
            }
        }, 1500);
    }
    isPlaying.value = !isPlaying.value;
}

watch(isPlaying, (newValue) => {
    if (!newValue) {
        clearInterval(playInterval);
    }
});

onMounted(() => {
    initializeMap();
});
</script>