import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  getSupplyChainSummary as fetchSummary, 
  getSupplyChainCompanies as fetchCompanies
} from '@/services/api';
import { useFeedbackStore } from './feedbackStore';

export const useSupplyChainStore = defineStore('supplyChain', () => {
  // --- State ---
  const summary = ref(null);
  const companies = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const filters = ref({ name: '', industry: '', finance: '', law: '', tech: '', credit: '' });
  const sort = ref({ key: 'id', direction: 'asc' });
  const pagination = ref({ currentPage: 1, pageSize: 10 });
  const pageSizeOptions = ref([10, 20, 50, 100]);

  const feedback = useFeedbackStore();

  // --- Getters (Computed) ---
  const riskLevelOptions = computed(() => [
    { value: '高', label: '高' },
    { value: '中', label: '中' },
    { value: '低', label: '低' },
  ]);

  const uniqueIndustries = computed(() => {
    const industries = companies.value.map(c => c.industry).filter(Boolean);
    return [...new Set(industries)].map(i => ({ value: i, label: i }));
  });

  const filteredCompanies = computed(() => {
    return companies.value
      .filter(c => {
        const nameMatch = c.name?.toLowerCase().includes(filters.value.name.toLowerCase());
        const industryMatch = !filters.value.industry || c.industry === filters.value.industry;
        const financeMatch = !filters.value.finance || c.finance === filters.value.finance;
        const lawMatch = !filters.value.law || c.law === filters.value.law;
        const techMatch = !filters.value.tech || c.tech === filters.value.tech;
        const creditMatch = !filters.value.credit || c.credit === filters.value.credit;
        return nameMatch && industryMatch && financeMatch && lawMatch && techMatch && creditMatch;
      })
      .sort((a, b) => {
        const key = sort.value.key;
        if (!key || a[key] === undefined || b[key] === undefined) return 0;
        const valA = a[key];
        const valB = b[key];
        const direction = sort.value.direction === 'asc' ? 1 : -1;
        if (valA < valB) return -1 * direction;
        if (valA > valB) return 1 * direction;
        return 0;
      });
  });

  const totalPages = computed(() => Math.ceil(filteredCompanies.value.length / pagination.value.pageSize));

  const paginatedCompanies = computed(() => {
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize;
    const end = start + pagination.value.pageSize;
    return filteredCompanies.value.slice(start, end);
  });

  // --- Actions ---
  async function getSupplyChainSummary() {
    isLoading.value = true;
    const { data } = await fetchSummary();
    summary.value = data;
    isLoading.value = false;
  }

  async function getSupplyChainCompanies() {
    isLoading.value = true;
    // Fetch all data and filter/paginate on the client-side
    const { data, error: err } = await fetchCompanies({ page: 1, pageSize: 5000 });
    if (err) {
      feedback.show('无法加载企业列表', 'error');
    } else {
      companies.value = data.records || [];
    }
    isLoading.value = false;
  }

  function applyFilters() {
    pagination.value.currentPage = 1;
  }

  function resetFilters() {
    filters.value = { name: '', industry: '', finance: '', law: '', tech: '', credit: '' };
    pagination.value.currentPage = 1;
  }

  function sortBy(key) {
    if (sort.value.key === key) {
      sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc';
    } else {
      sort.value.key = key;
      sort.value.direction = 'asc';
    }
  }

  function setPage(page) {
    if (page > 0 && page <= totalPages.value) {
      pagination.value.currentPage = page;
    }
  }

  function setPageSize(size) {
    pagination.value.pageSize = size;
    pagination.value.currentPage = 1; // Reset to first page
  }

  return {
    summary, companies, isLoading, error, filters, sort, pagination, pageSizeOptions,
    riskLevelOptions, uniqueIndustries, filteredCompanies, totalPages, paginatedCompanies,
    getSupplyChainSummary, getSupplyChainCompanies, applyFilters, resetFilters, sortBy, setPage, setPageSize,
  };
});
