import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getMonitoringData } from '@/services/api';

export const useMonitoringStore = defineStore('monitoring', () => {
  const topNews = ref([]);
  const riskNews = ref([]);

  async function fetchData() {
    const { data, error } = await getMonitoringData();
    if (error) {
        console.error("Failed to fetch monitoring data", error);
        return;
    }
    topNews.value = data.topNews;
    riskNews.value = data.riskNews;
  }

  function getNewsById(id) {
    return topNews.value.find(a => a.id === id);
  }

  function getRiskById(id) {
    return riskNews.value.find(a => a.id === id);
  }

  fetchData();

  return {
    topNews,
    riskNews,
    getNewsById,
    getRiskById,
    fetchData,
  };
});