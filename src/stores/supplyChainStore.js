import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';
import { getSupplyChainData } from '@/services/api';
import { downloadFile, parseCsv } from '@/utils/helpers';
import { useFeedbackStore } from './feedbackStore';

export const useSupplyChainStore = defineStore('supplyChain', () => {
  const feedback = useFeedbackStore();

  const allCompanies = ref([]);
  const companies = ref([]);
  const summary = ref({});
  const pagination = ref({ currentPage: 1, pageSize: 10 });
  const filters = ref({ name: '', industry: '全部行业', tech: '全部', finance: '全部', law: '全部', credit: '全部' });
  const sort = ref({ key: 'id', direction: 'asc' });
  const selectedIds = ref(new Set());
  const columnVisibility = ref({ id: true, name: true, industry: true, tech: true, finance: true, law: true, credit: true, reason: true, actions: true });

  const isLoading = ref(true);
  const filteredCompanies = ref([]);

  const uniqueIndustries = computed(() => ['全部行业', ...new Set(allCompanies.value.map(c => c.industry))]);
  const riskLevelOptions = computed(() => ['全部', '高', '中', '低']);
  const visibleColumnsCount = computed(() => Object.values(columnVisibility.value).filter(Boolean).length);
  const totalPages = computed(() => Math.ceil(filteredCompanies.value.length / pagination.value.pageSize) || 1);

  const paginatedCompanies = computed(() => {
    if (pagination.value.currentPage > totalPages.value) {
      pagination.value.currentPage = totalPages.value || 1;
    }
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize;
    const end = start + pagination.value.pageSize;
    return filteredCompanies.value.slice(start, end);
  });

  const isAllSelectedOnPage = computed(() => paginatedCompanies.value.length > 0 && paginatedCompanies.value.every(c => selectedIds.value.has(c.id)));
  const isAnySelectedOnPage = computed(() => paginatedCompanies.value.some(c => selectedIds.value.has(c.id)));

  function applyFiltersAndSort() {
    isLoading.value = true;
    nextTick(() => {
      let result = companies.value.filter(c => {
        const nameMatch = c.name.toLowerCase().includes(filters.value.name.toLowerCase());
        const industryMatch = filters.value.industry === '全部行业' || c.industry === filters.value.industry;
        const techMatch = filters.value.tech === '全部' || c.tech === filters.value.tech;
        const financeMatch = filters.value.finance === '全部' || c.finance === filters.value.finance;
        const lawMatch = filters.value.law === '全部' || c.law === filters.value.law;
        const creditMatch = filters.value.credit === '全部' || c.credit === filters.value.credit;
        return nameMatch && industryMatch && techMatch && financeMatch && lawMatch && creditMatch;
      });

      result.sort((a, b) => {
        const key = sort.value.key;
        let valA = a[key];
        let valB = b[key];
        const riskOrder = { '低': 1, '中': 2, '高': 3 };

        if (['tech', 'finance', 'law', 'credit'].includes(key)) {
          valA = riskOrder[valA] || 0;
          valB = riskOrder[valB] || 0;
        }

        if (valA < valB) return sort.value.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.value.direction === 'asc' ? 1 : -1;
        return 0;
      });

      filteredCompanies.value = result;
      isLoading.value = false;
    });
  }

  function applyFilters() {
    if (pagination.value.currentPage !== 1) pagination.value.currentPage = 1;
    applyFiltersAndSort();
  }

  function resetFilters() {
    filters.value = { name: '', industry: '全部行业', tech: '全部', finance: '全部', law: '全部', credit: '全部' };
    applyFilters();
  }

  function sortBy(key) {
    if (sort.value.key === key) {
      sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc';
    } else {
      sort.value.key = key;
      sort.value.direction = 'asc';
    }
    applyFiltersAndSort();
  }

  async function fetchData() {
    isLoading.value = true;
    const { data, error } = await getSupplyChainData();
    if (error) {
      feedback.show('供应链数据加载失败', 'error');
      isLoading.value = false;
      return;
    }
    allCompanies.value = data.companies;
    companies.value = data.companies;
    summary.value = data.summary;
    applyFiltersAndSort();
    isLoading.value = false;
  }

  fetchData();

  function setPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      pagination.value.currentPage = page;
    }
  }

  function saveCompany(companyData) {
    const isNew = !companyData.id;
    if (isNew) {
      companyData.id = Math.max(0, ...companies.value.map(c => c.id)) + 1;
      companies.value.unshift(companyData);
    } else {
      const index = companies.value.findIndex(c => c.id === companyData.id);
      if (index !== -1) companies.value.splice(index, 1, companyData);
    }
    applyFiltersAndSort();
    feedback.show(isNew ? '新增企业成功!' : '保存成功!', 'success');
  }

  function deleteCompanyById(companyId) {
    const company = companies.value.find(c => c.id === companyId);
    if (company) {
      companies.value = companies.value.filter(c => c.id !== companyId);
      selectedIds.value.delete(companyId);
      applyFiltersAndSort();
      feedback.show(`企业“${company.name}”已删除`, 'success');
    }
  }

  function toggleSelectAllOnPage() {
    const pageIds = paginatedCompanies.value.map(c => c.id);
    if (isAllSelectedOnPage.value) {
      pageIds.forEach(id => selectedIds.value.delete(id));
    } else {
      pageIds.forEach(id => selectedIds.value.add(id));
    }
  }

  function exportData() {
    if (selectedIds.value.size === 0) {
      feedback.show("请至少选择一个企业进行导出。", "error");
      return;
    }
    const headers = Object.keys(columnVisibility.value).filter(k => k !== 'actions' && columnVisibility.value[k]);
    const selected = companies.value.filter(c => selectedIds.value.has(c.id));
    const rows = selected.map(c => headers.map(h => JSON.stringify(c[h] || '')).join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadFile("supply_chain_export.csv", csvContent, 'text/csv;charset=utf-8;', true);
    feedback.show('选中企业已成功导出!', 'success');
  }

  async function importData(file) {
    if (!file) return;
    try {
      const requiredHeaders = ['name', 'industry', 'tech', 'finance', 'law', 'credit', 'reason'];

      // 使用正确的选项对象来调用 parseCsv
      const newCompanies = await parseCsv(file, {
        hasHeader: true,
        requiredHeaders: requiredHeaders
      });

      let maxId = Math.max(0, ...companies.value.map(c => c.id));
      newCompanies.forEach(nc => {
        nc.id = ++maxId;
        companies.value.unshift(nc);
      });

      applyFiltersAndSort();
      feedback.show(`成功导入 ${newCompanies.length} 家企业。`, 'success');
    } catch (error) {
      feedback.show(`导入失败: ${error.message}`, 'error', 5000);
    }
  }

  return {
    companies, summary, pagination, filters, sort, selectedIds, columnVisibility, isLoading,
    uniqueIndustries, riskLevelOptions, filteredCompanies, paginatedCompanies, totalPages, isAllSelectedOnPage, isAnySelectedOnPage, visibleColumnsCount,
    applyFilters, resetFilters, sortBy, setPage, saveCompany, deleteCompanyById, toggleSelectAllOnPage, exportData, importData,
  };
});