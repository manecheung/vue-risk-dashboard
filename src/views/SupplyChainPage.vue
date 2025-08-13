<template>
  <main class="flex flex-col p-6" style="height: calc(100vh - 4rem);">
    <header class="flex-shrink-0 mb-4 text-sm text-slate-400" aria-label="面包屑导航">供应链风险评估 / 风险评估列表</header>

    <section v-if="store.summary" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4 flex-shrink-0" aria-label="风险统计摘要">
      <!-- Summary cards remain the same -->
      <div class="panel !flex-row items-center p-4">
        <div class="p-3 bg-blue-500/10 rounded-lg mr-4"><span class="text-3xl font-bold text-blue-400">{{ store.summary.networkRisk }}</span></div>
        <div><p class="text-sm text-slate-400">网络风险</p></div>
      </div>
      <div class="panel !flex-row items-center p-4">
        <div class="p-3 bg-red-500/10 rounded-lg mr-4"><span class="text-3xl font-bold text-red-400">{{ store.summary.highRiskCount }}</span></div>
        <div><p class="text-sm text-slate-400">高风险企业(家)</p></div>
      </div>
      <div class="panel !flex-row items-center p-4">
        <div class="p-3 bg-amber-500/10 rounded-lg mr-4"><span class="text-3xl font-bold text-amber-400">{{ store.summary.mediumRiskCount }}</span></div>
        <div><p class="text-sm text-slate-400">中风险企业(家)</p></div>
      </div>
      <div class="panel !flex-row items-center p-4">
        <div class="p-3 bg-green-500/10 rounded-lg mr-4"><span class="text-3xl font-bold text-green-400">{{ store.summary.lowRiskCount }}</span></div>
        <div><p class="text-sm text-slate-400">低风险企业(家)</p></div>
      </div>
    </section>

    <div class="panel flex-grow min-h-0 flex flex-col relative">
      <div class="flex-shrink-0 flex flex-col md:flex-row items-start justify-between gap-4 p-4 border-b border-slate-700">
        <form @submit.prevent="store.applyFilters" class="flex flex-wrap items-center gap-x-4 gap-y-2">
          <!-- Filters remain the same -->
          <div class="flex items-center space-x-2 w-60">
            <label for="companyName" class="text-sm text-slate-400 shrink-0">企业名称</label>
            <input type="text" id="companyName" v-model="store.filters.name" class="form-input w-full text-sm" placeholder="关键词...">
          </div>
          <div class="flex items-center space-x-2 w-60">
            <label for="industry" class="text-sm text-slate-400 shrink-0">行业</label>
            <CustomSelect id="industry" v-model="store.filters.industry" :options="store.uniqueIndustries" placeholder="全部行业" />
          </div>
          <div class="flex items-center space-x-2 w-40">
            <label for="filter-finance" class="text-sm text-slate-400 shrink-0">财务风险</label>
            <CustomSelect id="filter-finance" v-model="store.filters.finance" :options="store.riskLevelOptions" placeholder="全部" />
          </div>
          <div class="flex items-center space-x-2 w-40">
            <label for="filter-law" class="text-sm text-slate-400 shrink-0">法律风险</label>
            <CustomSelect id="filter-law" v-model="store.filters.law" :options="store.riskLevelOptions" placeholder="全部" />
          </div>
          <div class="flex items-center space-x-2 w-40">
            <label for="filter-tech" class="text-sm text-slate-400 shrink-0">技术风险</label>
            <CustomSelect id="filter-tech" v-model="store.filters.tech" :options="store.riskLevelOptions" placeholder="全部" />
          </div>
          <div class="flex items-center space-x-2 w-40">
            <label for="filter-credit" class="text-sm text-slate-400 shrink-0">信用风险</label>
            <CustomSelect id="filter-credit" v-model="store.filters.credit" :options="store.riskLevelOptions" placeholder="全部" />
          </div>
          <button type="submit" class="btn btn-primary text-sm" title="根据当前条件进行查询">查询</button>
          <button type="button" @click="store.resetFilters" class="btn btn-secondary text-sm" title="清空所有筛选条件">重置</button>
        </form>
        <!-- Action buttons are removed -->
      </div>

      <div class="flex-grow overflow-auto">
        <DataTable :columns="allColumns" :items="store.paginatedCompanies" :is-loading="store.isLoading" :sort-key="store.sort.key" :sort-direction="store.sort.direction" min-width="1400px" aria-label="供应链企业风险列表" empty-message="没有匹配的数据。请尝试调整筛选条件。" @sort="store.sortBy">
          <!-- Template slots for custom cell rendering -->
          <template #cell-name="{ item }">
            <span class="text-slate-200">{{ item.name }}</span>
          </template>
          <template #cell-tech="{ item }">
            <span class="font-bold" :class="getRiskStyling(item.tech).text">{{ item.tech }}</span>
          </template>
          <template #cell-finance="{ item }">
            <span class="font-bold" :class="getRiskStyling(item.finance).text">{{ item.finance }}</span>
          </template>
          <template #cell-law="{ item }">
            <span class="font-bold" :class="getRiskStyling(item.law).text">{{ item.law }}</span>
          </template>
          <template #cell-credit="{ item }">
            <span class="font-bold" :class="getRiskStyling(item.credit).text">{{ item.credit }}</span>
          </template>
        </DataTable>
      </div>

      <footer class="flex-shrink-0 flex justify-between items-center p-3 border-t border-slate-700 text-sm text-slate-400">
        <div>共 {{ store.filteredCompanies.length }} 条</div>
        <nav class="flex items-center space-x-4" aria-label="分页">
          <div class="flex items-center space-x-2">
            <label for="pageSize" class="text-xs">每页</label>
            <div class="w-20">
              <CustomSelect id="pageSize" :model-value="store.pagination.pageSize" @update:modelValue="store.setPageSize($event)" :options="store.pageSizeOptions.map(s => ({value: s, label: s}))" direction="up" />
            </div>
          </div>
          <button @click="store.setPage(store.pagination.currentPage - 1)" :disabled="store.pagination.currentPage === 1" class="btn btn-secondary text-xs px-3 py-1" aria-label="上一页">上一页</button>
          <span>{{ store.pagination.currentPage }} / {{ store.totalPages }}</span>
          <button @click="store.setPage(store.pagination.currentPage + 1)" :disabled="store.pagination.currentPage >= store.totalPages" class="btn btn-secondary text-xs px-3 py-1" aria-label="下一页">下一页</button>
        </nav>
      </footer>
    </div>

    <!-- Modals are kept in case they are needed later, but triggering buttons are removed -->
    <ConfirmModal :is-open="isConfirmModalOpen" title="确认删除" @confirm="handleDelete" @cancel="isConfirmModalOpen = false">
      <p>您确定要删除企业“<strong class="text-amber-400">{{ companyToDelete?.name }}</strong>”吗？此操作无法撤销。</p>
    </ConfirmModal>

    <SupplyChainFormModal :is-open="isFormModalOpen" :company-data="editingCompany" @save="handleSave" @close="isFormModalOpen = false" />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupplyChainStore } from '@/stores/supplyChainStore';
import { getRiskStyling } from '@/utils/helpers';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import CustomSelect from '@/components/common/CustomSelect.vue';
import SupplyChainFormModal from '@/components/supply-chain/SupplyChainFormModal.vue';
import DataTable from '@/components/common/DataTable.vue';

// Columns are now simplified, removing select and actions
const allColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: '公司名称', sortable: true },
  { key: 'industry', label: '行业', sortable: true },
  { key: 'tech', label: '技术风险', sortable: true },
  { key: 'finance', label: '财务风险', sortable: true },
  { key: 'law', label: '法律风险', sortable: true },
  { key: 'credit', label: '信用风险', sortable: true },
  { key: 'reason', label: '核心风险事由', sortable: false },
];

const store = useSupplyChainStore();

// UI state for modals is kept but their triggers are removed from the template
const isFormModalOpen = ref(false);
const editingCompany = ref(null);
const isConfirmModalOpen = ref(false);
const companyToDelete = ref(null);

// These functions are kept for potential future use, though buttons are removed
const openFormModal = (company = null) => {
  editingCompany.value = company;
  isFormModalOpen.value = true;
};

const handleSave = (companyData) => {
  store.saveCompany(companyData);
  isFormModalOpen.value = false;
};

const openConfirmModal = (company) => {
  companyToDelete.value = company;
  isConfirmModalOpen.value = true;
};

const handleDelete = () => {
  if (companyToDelete.value) {
    store.deleteCompanyById(companyToDelete.value.id);
  }
  isConfirmModalOpen.value = false;
};

onMounted(() => {
  store.getSupplyChainSummary();
  store.getSupplyChainCompanies();
});
</script>