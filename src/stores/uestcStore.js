import { defineStore } from 'pinia';
import { getUestcIndustryChainList, getUestcRiskGraph, getUestcRiskStatusPeriods, getUestcRiskStatusOverview } from '@/services/api';

export const useUestcStore = defineStore('uestc', {
  state: () => ({
    industryChains: [],
    riskGraph: { nodes: [], edges: [] },
    periods: [],
    selectedPeriod: null,
    overview: null,
    selectedIndustryChain: null,
    loading: false,
    error: null,
  }),
  
  getters: {
    hasValidGraphData: (state) => {
      return state.riskGraph?.nodes?.length > 0;
    },
    nodeCount: (state) => state.riskGraph?.nodes?.length || 0,
    edgeCount: (state) => state.riskGraph?.edges?.length || 0,
  },

  actions: {
    setError(error) {
      this.error = error;
      console.error('❌ Store Error:', error);
    },

    clearError() {
      this.error = null;
    },

    async fetchIndustryChains() {
      console.log('🏭 开始获取产业链列表...');
      this.loading = true;
      this.clearError();
      
      try {
        const industryChains = await getUestcIndustryChainList();
        this.industryChains = Array.isArray(industryChains) ? industryChains : [];
        
        if (this.industryChains.length > 0) {
          this.selectedIndustryChain = this.industryChains[0].id;
          await Promise.all([
            this.fetchRiskGraph(),
            this.fetchPeriods()
          ]);
        } else {
          console.warn('⚠️ 没有可用的产业链数据');
        }
      } catch (error) {
        this.setError(`获取产业链列表失败: ${error.message}`);
        this.industryChains = [];
        this.selectedIndustryChain = null;
      } finally {
        this.loading = false;
        console.log('🏁 产业链获取流程结束');
      }
    },

    extractGraphData(apiResponse) {
        if (!apiResponse) {
            console.warn('⚠️ API响应为空，无法提取图谱数据');
            return null;
        }

        let nodes = null;
        let edges = null;

        // 模式1: 顶层直接包含 nodes/vertices 和 edges/links
        nodes = apiResponse.nodes || apiResponse.vertexs || apiResponse.vertices;
        edges = apiResponse.edges || apiResponse.links;

        if (nodes && edges) {
            console.log('✅ 图谱数据提取成功 (模式1: 顶层)');
            return { nodes, edges };
        }

        // 模式2: 数据在 'data' 属性中
        if (apiResponse.data) {
            nodes = apiResponse.data.nodes || apiResponse.data.vertexs || apiResponse.data.vertices;
            edges = apiResponse.data.edges || apiResponse.data.links;
            if (nodes && edges) {
                console.log('✅ 图谱数据提取成功 (模式2: data属性)');
                return { nodes, edges };
            }
        }
        
        // 模式3: 数据在 'graph' 对象中 (可能嵌套在 'data' 中)
        const graphObject = apiResponse.graph || (apiResponse.data ? apiResponse.data.graph : null);
        if (graphObject) {
            nodes = graphObject.nodes || graphObject.vertexs || graphObject.vertices;
            edges = graphObject.edges || graphObject.links;
            if (nodes && edges) {
                console.log('✅ 图谱数据提取成功 (模式3: graph对象)');
                return { nodes, edges };
            }
        }

        console.warn('⚠️ 无法在API响应中找到有效的图谱数据结构');
        return null;
    },

    async fetchRiskGraph() {
      if (!this.selectedIndustryChain) {
        console.warn('⚠️ 没有选中的产业链，跳过图谱获取');
        return;
      }

      console.log('📊 开始获取风险图谱...', { industryChain: this.selectedIndustryChain });
      this.loading = true;
      this.clearError();
      
      this.riskGraph = { nodes: [], edges: [] };

      try {
        const apiResponse = await getUestcRiskGraph(this.selectedIndustryChain);
        console.log('📡 API返回原始数据:', apiResponse);

        // 使用新的、更强大的提取函数
        const graphData = this.extractGraphData(apiResponse);

        if (!graphData) {
          this.setError('图谱数据格式不正确或为空');
          return;
        }

        // 现在 graphData 保证是 { nodes: [...], edges: [...] } 格式
        const processedData = this.processGraphData(graphData);
        
        if (processedData.nodes.length === 0) {
          console.warn('⚠️ 处理后无有效节点数据');
          this.setError('暂无图谱数据');
          return;
        }

        this.riskGraph = processedData;
        console.log('✅ 图谱数据处理完成:', {
          nodeCount: processedData.nodes.length,
          edgeCount: processedData.edges.length
        });

      } catch (error) {
        this.setError(`获取图谱数据失败: ${error.message}`);
        console.error('❌ 图谱获取错误详情:', error);
      } finally {
        this.loading = false;
      }
    },

    processGraphData(rawData) {
      try {
        if (!rawData || !rawData.nodes || !rawData.edges) {
            throw new Error('传入的图谱数据(rawData)不符合{nodes, edges}结构');
        }

        const rawNodes = rawData.nodes;
        const rawEdges = rawData.edges;

        if (!Array.isArray(rawNodes)) {
          throw new Error('节点数据格式错误，期望是一个数组');
        }
        if (!Array.isArray(rawEdges)) {
            throw new Error('边数据格式错误，期望是一个数组');
        }

        // 节点去重和验证
        const seenNodeIds = new Set();
        const validNodes = rawNodes.filter(node => {
          if (!node || node.id === null || node.id === undefined) {
            console.warn('🛡️ 过滤无效节点 (id为空):', node);
            return false;
          }
          const nodeId = String(node.id);
          if (seenNodeIds.has(nodeId)) {
            console.warn(`🛡️ 过滤重复节点: id=${nodeId}`);
            return false;
          }
          seenNodeIds.add(nodeId);
          return true;
        });

        const validNodeIds = new Set(validNodes.map(n => String(n.id)));

        const validEdges = rawEdges.filter(edge => {
          if (!edge || !edge.source || !edge.target) {
            console.warn('🛡️ 过滤无效边 (source/target为空):', edge);
            return false;
          }
          const sourceId = String(edge.source);
          const targetId = String(edge.target);
          if (!validNodeIds.has(sourceId) || !validNodeIds.has(targetId)) {
            console.warn('🛡️ 过滤悬挂边 (节点不存在):', edge);
            return false;
          }
          return true;
        });

        // 生成最终数据
        const processedNodes = validNodes.map((node, index) => ({
          ...node,
          id: String(node.id),
          label: node.name || `节点${node.id}`,
          x: Math.cos(index * 2 * Math.PI / validNodes.length) * 300 + 400,
          y: Math.sin(index * 2 * Math.PI / validNodes.length) * 300 + 400,
          style: {
            fill: this.getCategoryColor(node.category),
            stroke: this.getCategoryColor(node.category, true),
          }
        }));

        const processedEdges = validEdges.map(edge => ({
          ...edge,
          id: `edge-${edge.source}-${edge.target}-${Math.random()}`, // 确保边ID唯一
          source: String(edge.source),
          target: String(edge.target),
          label: edge.label || '',
        }));

        console.log('📊 数据处理统计:', {
          原始节点: rawNodes.length,
          有效节点: processedNodes.length,
          原始边: rawEdges.length,
          有效边: processedEdges.length
        });

        return {
          nodes: processedNodes,
          edges: processedEdges,
        };

      } catch (error) {
        console.error('❌ 数据处理失败:', error);
        this.setError(`处理图谱数据时出错: ${error.message}`);
        return { nodes: [], edges: [] };
      }
    },

    getCategoryColor(category, isStroke = false) {
      const colorMap = {
        '产品': isStroke ? '#3182ce' : '#63b3ed',
        '核心企业': isStroke ? '#c53030' : '#f56565',
        '上游企业': isStroke ? '#2b6cb0' : '#4299e1',
        '下游企业': isStroke ? '#2f855a' : '#48bb78',
        '风险': isStroke ? '#c05621' : '#f6ad55',
      };
      return colorMap[category] || (isStroke ? '#4a5568' : '#a0aec0');
    },

    async fetchPeriods() {
      if (!this.selectedIndustryChain) return;
      
      try {
        const periods = await getUestcRiskStatusPeriods(this.selectedIndustryChain);
        this.periods = Array.isArray(periods) ? periods : [];
        
        if (this.periods.length > 0) {
          this.selectedPeriod = this.periods[0];
          await this.fetchOverview();
        } else {
          this.selectedPeriod = null;
        }
      } catch (error) {
        this.setError(`获取可用时段失败: ${error.message}`);
        this.periods = [];
        this.selectedPeriod = null;
      }
    },

    async fetchOverview() {
      if (!this.selectedIndustryChain || !this.selectedPeriod) return;
      
      try {
        const overviewData = await getUestcRiskStatusOverview(
          this.selectedIndustryChain, 
          this.selectedPeriod
        );
        this.overview = overviewData;
      } catch (error) {
        this.setError(`获取风险概览失败: ${error.message}`);
        this.overview = null;
      }
    },

    async selectIndustryChain(industryChainId) {
      if (this.selectedIndustryChain === industryChainId) return;
      
      console.log('🏭 切换产业链:', industryChainId);
      this.selectedIndustryChain = industryChainId;
      this.periods = [];
      this.selectedPeriod = null;
      this.overview = null;
      this.clearError();
      
      await Promise.all([
        this.fetchRiskGraph(),
        this.fetchPeriods()
      ]);
    },

    async selectPeriod(period) {
      if (this.selectedPeriod === period) return;
      
      console.log('📅 切换时段:', period);
      this.selectedPeriod = period;
      await this.fetchOverview();
    }
  },
});