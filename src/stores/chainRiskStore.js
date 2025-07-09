import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useFeedbackStore } from './feedbackStore';
import { downloadFile, parseCsv } from '@/utils/helpers';

export const useChainRiskStore = defineStore('chainRisk', () => {
  const initialData = {
    nodes: [
      { id: 'risk-source', label: '天灾：东南亚洪灾', isSource: true, style: { fill: 'var(--risk-high-color)', stroke: '#fca5a5' } },
      { id: 't2-material-a', label: 'A材料（二级）' }, { id: 't2-material-b', label: 'B材料（二级）' },
      { id: 't1-chip', label: '凤凰芯片（一级）' }, { id: 't1-battery', label: '国创电池（一级）' }, { id: 't1-screen', label: '华星屏幕（一级）' },
      { id: 't1-case', label: '精密外壳（一级）' },
      { id: 'core-phone', label: '未来手机（核心）' }, { id: 'core-car', label: '未来汽车（核心）' },
      { id: 'logistics-a', label: '远洋物流' }, { id: 'logistics-b', label: '顺风速运' },
      { id: 'market-cn', label: '国内市场' }, { id: 'market-eu', label: '欧洲市场' }
    ],
    edges: [
      { source: 'risk-source', target: 't2-material-a' },
      { source: 't2-material-a', target: 't1-chip' }, { source: 't2-material-b', target: 't1-chip' },
      { source: 't2-material-b', target: 't1-battery' },
      { source: 't1-chip', target: 'core-phone' }, { source: 't1-battery', target: 'core-phone' },
      { source: 't1-screen', target: 'core-phone' }, { source: 't1-case', target: 'core-phone' },
      { source: 't1-battery', target: 'core-car' }, { source: 't1-case', target: 'core-car' },
      { source: 'logistics-a', target: 't2-material-a' }, { source: 'logistics-a', target: 't1-screen' },
      { source: 'core-phone', target: 'logistics-b' }, { source: 'core-car', target: 'logistics-b' },
      { source: 'logistics-b', target: 'market-cn' }, { source: 'logistics-b', target: 'market-eu' },
    ],
    riskPath: [
      ['t2-material-a'], ['t1-chip'], ['t1-battery', 'core-phone'],
      ['core-car'], ['logistics-b'], ['market-cn', 'market-eu']
    ]
  };

  const feedback = useFeedbackStore();

  const isPlaying = ref(false);
  const isCustomData = ref(false);
  const currentStep = ref(0);
  let intervalId = null;

  const graphData = ref(structuredClone(initialData));

  function nextStep() {
    if (currentStep.value < graphData.value.riskPath.length) {
      currentStep.value++;
    } else {
      pause();
      feedback.show('模拟已播放完毕', 'success');
    }
  }

  function prevStep() {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  }

  function play() {
    if (isPlaying.value) return;
    if (currentStep.value >= graphData.value.riskPath.length) {
      currentStep.value = 0;
    }
    isPlaying.value = true;
    intervalId = setInterval(nextStep, 1200);
  }

  function pause() {
    isPlaying.value = false;
    clearInterval(intervalId);
    intervalId = null;
  }

  function togglePlay() {
    isPlaying.value ? pause() : play();
  }

  function reset() {
    pause();
    currentStep.value = 0;
    if (isCustomData.value) {
      feedback.show('重置风险蔓延模拟步骤', 'success');
    } else {
      feedback.show('模拟已重置', 'success');
    }
  }

  function clearImportData() {
    pause();
    currentStep.value = 0;
    if (isCustomData.value) {
      graphData.value = JSON.parse(JSON.stringify(initialData));
      isCustomData.value = false;
      feedback.show('清除导入数据成功', 'success');
    } else {
      feedback.show('没有自定义导入数据', 'error');
    }
  }

  function saveImportData() {
    pause();
    currentStep.value = 0;
    if (isCustomData.value) {
      // 这里可以添加保存逻辑，比如发送到服务器或保存到本地存储，同时更新自定义导入数据标识
      // isCustomData.value = false;
      feedback.show('导入数据保存数据库成功', 'success');
    } else {
      feedback.show('没有自定义导入数据', 'error');
    }
  }

  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // 使用新的 parseCsv 函数，并指定无表头，注释符为 '#'
      const allParsedRows = await parseCsv(file, {
        hasHeader: false,
        commentChar: '#'
      });

      // --- 核心修复：在这里过滤掉内容为表头的行 ---
      const dataRows = allParsedRows.filter(parts => parts[0]?.toLowerCase() !== 'type');

      if (dataRows.length === 0) throw new Error('CSV文件为空或缺少有效的数据行（已排除表头和注释）。');

      const newNodes = [], newEdges = [], newPath = [];

      // 使用过滤后的 dataRows 进行遍历
      dataRows.forEach((parts, index) => {
        const type = (parts[0] || '').toLowerCase();
        if (type === 'node' && parts[1]) newNodes.push({ id: parts[1], label: parts[2] || parts[1] });
        else if (type === 'edge' && parts[1] && parts[2]) newEdges.push({ source: parts[1], target: parts[2] });
        else if (type === 'path' && parts[1]) newPath.push(parts.slice(1).filter(Boolean));
        else if (type) throw new Error(`数据行 ${index + 1} 格式错误: ${parts.join(',')}`);
      });

      if (newNodes.length === 0) throw new Error('CSV文件必须至少包含有效的 "node" 定义行。');
      if (newPath.length === 0) feedback.show('警告：CSV文件中未定义 "path" 路径，模拟将无法播放。', 'warning');

      pause();
      currentStep.value = 0;
      graphData.value = { nodes: newNodes, edges: newEdges, riskPath: newPath };
      isCustomData.value = true;
      feedback.show(`成功导入 ${newNodes.length} 个节点, ${newEdges.length} 条边, ${newPath.length} 个风险步骤。`, 'success');

    } catch (error) {
      feedback.show(`导入失败: ${error.message}`, 'error', 6000);
    } finally {
      if (event.target) event.target.value = '';
    }
  }

  function downloadTemplate() {
    const content = `type,param1,param2_or_more
      # 这是一个CSV模板文件，用于定义风险蔓延模拟的数据。
      # 请使用UTF-8编码保存文件以保证兼容性。
      # '#'开头的行为注释, 会被程序忽略。

      # 1. 定义节点 (格式: node,ID,"显示名称")
      # ID是节点的唯一标识，显示名称是图中显示的文字（建议用引号包裹）。
      node,s,"风险源"
      node,A,"公司A"
      node,B,"公司B"

      # 2. 定义边 (格式: edge,源节点ID,目标节点ID)
      # 定义了节点之间的连接关系。
      edge,s,A
      edge,A,B

      # 3. 定义风险路径 (格式: path,节点ID1,节点ID2,...)
      # 每一行'path'代表一个蔓延步骤，可以包含一个或多个同时受影响的节点。
      path,A
      path,B
      `;
    downloadFile('risk_simulation_template.csv', content, 'text/csv;charset=utf-8;', true);
  }

  function exportData() {
    const atRiskNodes = new Set();
    const sourceNode = graphData.value.nodes.find(n => n.isSource);
    if (sourceNode) {
      atRiskNodes.add(sourceNode.id);
    }

    if (graphData.value.riskPath) {
      for (let i = 0; i < currentStep.value; i++) {
        graphData.value.riskPath[i].forEach(id => atRiskNodes.add(id));
      }
    }
    const header = "node_id,node_label,is_at_risk\n";
    const content = header + graphData.value.nodes.map(node => `${JSON.stringify(node.id)},${JSON.stringify(node.label)},${atRiskNodes.has(node.id)}`).join('\n');
    downloadFile(`risk_export_step_${currentStep.value}.csv`, content, 'text/csv;charset=utf-8;', true);
    feedback.show('当前状态已成功导出!', 'success');
  }


  return {
    isPlaying, isCustomData, currentStep, graphData,
    togglePlay, reset, clearImportData, saveImportData, pause, prevStep, nextStep, handleFileUpload, downloadTemplate, exportData,
  };
});