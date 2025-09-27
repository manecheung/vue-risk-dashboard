import { defineStore } from 'pinia';
import { getMaterialIndicators, getMaterialPrices, getMaterialPricePrediction } from '@/services/api';
import { useFeedbackStore } from './feedbackStore';

export const useMaterialPriceStore = defineStore('materialPrice', {
    state: () => ({
        indicators: [],
        priceData: {},
        prediction: null, // Will be an object { data: [], sourceLabel: '' }
        isLoading: false,
        isPredicting: false,
    }),

    getters: {
        chartData: (state) => {
            if (!state.priceData.labels || state.priceData.labels.length === 0) {
                return { labels: [], datasets: [] };
            }

            const originalLabels = state.priceData.labels;
            const originalDatasets = state.priceData.datasets.map(ds => ({ ...ds, tension: 0.1, pointRadius: 2, borderWidth: 2 }));

            // If no prediction data, return original chart data
            if (!state.prediction || !state.prediction.data || state.prediction.data.length === 0) {
                return {
                    labels: originalLabels,
                    datasets: originalDatasets
                };
            }

            const predictionLabels = state.prediction.data.map(p => p.date);
            const predictionValues = state.prediction.data.map(p => p.value);
            const combinedLabels = [...originalLabels, ...predictionLabels];

            const sourceDataset = originalDatasets.find(ds => ds.label === state.prediction.sourceLabel);
            if (!sourceDataset) {
                return { labels: originalLabels, datasets: originalDatasets };
            }

            // Find the last non-null value to connect the prediction line
            const lastValue = [...sourceDataset.data].reverse().find(d => d !== null);

            const predictionLine = {
                label: `${state.prediction.sourceLabel} (预测)`,
                data: [
                    ...Array(originalLabels.length - 1).fill(null),
                    lastValue,
                    ...predictionValues
                ],
                borderColor: '#f59e0b', // Amber color
                backgroundColor: '#f59e0b33', // Amber color with transparency
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 2,
                tension: 0.1,
            };

            return {
                labels: combinedLabels,
                datasets: [...originalDatasets, predictionLine]
            };
        },
    },

    actions: {
        async fetchIndicators() {
            this.isLoading = true;
            const feedback = useFeedbackStore();
            try {
                this.indicators = await getMaterialIndicators();
            } catch (error) {
                feedback.show('获取指标列表失败: ' + error.message, 'error');
            } finally {
                this.isLoading = false;
            }
        },

        async fetchPriceData(indicatorIds, startDate, endDate) {
            this.clearPrediction();
            if (!indicatorIds || indicatorIds.length === 0) {
                this.priceData = {};
                return;
            }

            this.isLoading = true;
            const feedback = useFeedbackStore();
            const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#BD10E0', '#9013FE'];
            const allLabels = new Set();
            const rawDatasets = [];

            try {
                for (let i = 0; i < indicatorIds.length; i++) {
                    const id = indicatorIds[i];
                    const indicator = this.indicators.find(ind => ind.id === id);
                    if (!indicator) continue;

                    try {
                        const prices = await getMaterialPrices({ indicatorId: id, startDate, endDate });
                        prices.forEach(p => allLabels.add(p.date));
                        rawDatasets.push({
                            label: indicator.quotaName,
                            pricePoints: prices,
                            borderColor: colors[i % colors.length],
                            backgroundColor: colors[i % colors.length] + '33',
                        });
                    } catch (error) {
                         feedback.show(`获取 ${indicator.quotaName} 价格失败: ${error.message}`, 'error');
                    }
                }

                const sortedLabels = Array.from(allLabels).sort((a, b) => new Date(a) - new Date(b));

                const alignedDatasets = rawDatasets.map(ds => {
                    const dataMap = new Map(ds.pricePoints.map(p => [p.date, p.value]));
                    return {
                        label: ds.label,
                        data: sortedLabels.map(label => dataMap.get(label) || null),
                        borderColor: ds.borderColor,
                        backgroundColor: ds.backgroundColor,
                    };
                });

                this.priceData = { labels: sortedLabels, datasets: alignedDatasets };

            } catch (error) {
                feedback.show('处理价格数据时出错: ' + error.message, 'error');
            } finally {
                this.isLoading = false;
            }
        },

        async fetchPrediction(indicatorId, indicatorName, days = 7) {
            this.isPredicting = true;
            const feedback = useFeedbackStore();
            try {
                const predictionResult = await getMaterialPricePrediction({ indicatorId, days });
                if (predictionResult && predictionResult.length > 0) {
                    this.prediction = {
                        data: predictionResult,
                        sourceLabel: indicatorName
                    };
                    feedback.show('价格预测成功!', 'success');
                } else {
                    this.prediction = null;
                    feedback.show('未能生成预测数据，可能是历史数据不足。', 'warning');
                }
            } catch (error) {
                this.prediction = null;
                feedback.show(`价格预测失败: ${error.message}`, 'error');
            } finally {
                this.isPredicting = false;
            }
        },

        clearPrediction() {
            this.prediction = null;
        }
    },
});
