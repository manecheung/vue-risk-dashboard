import { ref, watchEffect } from 'vue';
import * as echarts from 'echarts/core';

import {
  BarChart,
  PieChart,
  RadarChart,
  EffectScatterChart,
} from 'echarts/charts';

import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  GeoComponent,
  TitleComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  GeoComponent,
  TitleComponent,
  BarChart,
  PieChart,
  RadarChart,
  EffectScatterChart,
  CanvasRenderer,
]);

const chinaMapUrl = import.meta.env.VITE_CHINA_MAP_JSON_URL;

const chinaMapPromise = chinaMapUrl
  ? fetch(chinaMapUrl)
      .then(res => {
        if (!res.ok) throw new Error(`获取地图数据失败: ${res.status}`);
        return res.json();
      })
      .then(chinaJson => {
        echarts.registerMap('china', chinaJson);
        return true;
      })
      .catch(error => {
        console.error("地图数据注册失败:", error);
        return false;
      })
  : Promise.resolve(false);


export function useChart(options, isMap = false) {
  const chartContainerRef = ref(null);
  const isMapReady = ref(!isMap);
  const mapError = ref(null);
  let chartInstance = null;
  let resizeObserver = null;

  const resizeHandler = () => {
    chartInstance?.resize();
  };

  watchEffect(async (onCleanup) => {
    if (!chartContainerRef.value) return;

    if (isMap && !isMapReady.value) {
      try {
        await chinaMapPromise;
        isMapReady.value = true;
      } catch (e) {
        mapError.value = e.message || '地图数据加载失败';
        return;
      }
    }

    if (chartContainerRef.value && !chartInstance) {
        chartInstance = echarts.init(chartContainerRef.value);
        resizeObserver = new ResizeObserver(resizeHandler);
        resizeObserver.observe(chartContainerRef.value);
    }
    
    if (chartInstance && options.value) {
        chartInstance.setOption(options.value, true);
    }
    
    onCleanup(() => {
        resizeObserver?.disconnect();
        chartInstance?.dispose();
        chartInstance = null;
        resizeObserver = null;
    });
  });

  return { chartContainerRef, isMapReady, mapError };
}