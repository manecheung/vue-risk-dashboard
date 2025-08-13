<template>
  <Transition name="page-fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog" :aria-labelledby="title">
      <div class="panel w-full max-w-4xl max-h-[90vh] flex flex-col">
        <h2 :id="title" class="panel-title flex-shrink-0">{{ title }}</h2>
        <form @submit.prevent="save" class="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-grow">

          <!-- 基础信息 -->
          <fieldset class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-700 pt-4">
            <legend class="text-base font-semibold text-white -translate-y-7">基础信息</legend>
            <div>
              <label for="edit-name" class="form-label">公司名称</label>
              <input id="edit-name" type="text" v-model="form.name" required class="form-input">
            </div>
            <div>
              <label for="edit-industry" class="form-label">行业</label>
              <input id="edit-industry" type="text" v-model="form.industry" required class="form-input">
            </div>
            <div>
              <label for="edit-companyType" class="form-label">公司类型</label>
              <input id="edit-companyType" type="text" v-model="form.companyType" class="form-input">
            </div>
            <div>
              <label for="edit-registeredAddress" class="form-label">注册地址</label>
              <input id="edit-registeredAddress" type="text" v-model="form.registeredAddress" class="form-input">
            </div>
             <div class="flex items-center space-x-6">
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" v-model="form.isDiversified" class="form-checkbox mr-2">
                <span class="form-label">跨行业经营</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" v-model="form.isWellKnown" class="form-checkbox mr-2">
                <span class="form-label">是否Well Known</span>
              </label>
            </div>
          </fieldset>

          <!-- 产品信息 -->
          <fieldset class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-700 pt-4">
            <legend class="text-base font-semibold text-white -translate-y-7">产品信息</legend>
            <div>
              <label for="edit-majorProduct1" class="form-label">主要产品1</label>
              <input id="edit-majorProduct1" type="text" v-model="form.majorProduct1" class="form-input">
            </div>
            <div>
              <label for="edit-majorProduct2" class="form-label">主要产品2</label>
              <input id="edit-majorProduct2" type="text" v-model="form.majorProduct2" class="form-input">
            </div>
            <div class="md:col-span-2">
              <label for="edit-mainProductsSummary" class="form-label">主营产品总结</label>
              <textarea id="edit-mainProductsSummary" v-model="form.mainProductsSummary" class="form-input" rows="2"></textarea>
            </div>
            <div class="md:col-span-2">
              <label for="edit-relatedProducts" class="form-label">相关产品</label>
              <textarea id="edit-relatedProducts" v-model="form.relatedProducts" class="form-input" rows="2"></textarea>
            </div>
          </fieldset>

          <!-- 规模与财务 -->
          <fieldset class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 border-t border-slate-700 pt-4">
            <legend class="text-base font-semibold text-white -translate-y-7">规模与财务</legend>
            <div>
              <label for="edit-companySize" class="form-label">公司规模</label>
              <input id="edit-companySize" type="text" v-model="form.companySize" class="form-input">
            </div>
            <div>
              <label for="edit-employeeCount" class="form-label">员工数量</label>
              <input id="edit-employeeCount" type="text" v-model="form.employeeCount" class="form-input">
            </div>
            <div>
              <label for="edit-registeredCapital" class="form-label">注册资金</label>
              <input id="edit-registeredCapital" type="text" v-model="form.registeredCapital" class="form-input">
            </div>
            <div>
              <label for="edit-paidInCapital" class="form-label">实缴资本</label>
              <input id="edit-paidInCapital" type="text" v-model="form.paidInCapital" class="form-input">
            </div>
            <div>
              <label for="edit-revenue" class="form-label">营业额</label>
              <input id="edit-revenue" type="text" v-model="form.revenue" class="form-input">
            </div>
            <div>
              <label for="edit-assets" class="form-label">资产</label>
              <input id="edit-assets" type="text" v-model="form.assets" class="form-input">
            </div>
            <div>
              <label for="edit-profit" class="form-label">利润</label>
              <input id="edit-profit" type="text" v-model="form.profit" class="form-input">
            </div>
            <div>
              <label for="edit-stockPriceIndex" class="form-label">股价指数</label>
              <input id="edit-stockPriceIndex" type="text" v-model="form.stockPriceIndex" class="form-input">
            </div>
          </fieldset>

          <!-- 风险与评级 -->
          <fieldset class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 border-t border-slate-700 pt-4">
            <legend class="text-base font-semibold text-white -translate-y-7">风险与评级</legend>
            <div>
              <label for="edit-qualificationCertificateCount" class="form-label">资质证件数</label>
              <input id="edit-qualificationCertificateCount" type="number" v-model.number="form.qualificationCertificateCount" class="form-input">
            </div>
            <div>
              <label for="edit-taxRating" class="form-label">税评级</label>
              <input id="edit-taxRating" type="text" v-model="form.taxRating" class="form-input">
            </div>
            <div>
              <label for="edit-publicOpinionCount" class="form-label">公告数</label>
              <input id="edit-publicOpinionCount" type="number" v-model.number="form.publicOpinionCount" class="form-input">
            </div>
            <div>
              <label for="edit-legalDisputeCount" class="form-label">法务纠纷数</label>
              <input id="edit-legalDisputeCount" type="number" v-model.number="form.legalDisputeCount" class="form-input">
            </div>
          </fieldset>

          <div class="flex justify-end space-x-4 pt-4 flex-shrink-0">
            <button type="button" @click="$emit('close')" class="btn btn-secondary">取消</button>
            <button type="submit" class="btn btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useFeedbackStore } from '@/stores/feedbackStore';

const props = defineProps({
  isOpen: Boolean,
  companyData: Object, // Can be null for new company
});

const emit = defineEmits(['close', 'save']);
const feedback = useFeedbackStore();

const createFreshForm = () => ({
  id: null,
  name: '',
  majorProduct1: '',
  majorProduct2: '',
  mainProductsSummary: '',
  relatedProducts: '',
  industry: '',
  companyType: '',
  isDiversified: false,
  isWellKnown: false,
  companySize: '',
  employeeCount: '',
  registeredCapital: '',
  paidInCapital: '',
  revenue: '',
  assets: '',
  profit: '',
  stockPriceIndex: '',
  qualificationCertificateCount: 0,
  taxRating: '',
  publicOpinionCount: 0,
  legalDisputeCount: 0,
  registeredAddress: '',
  latitude: null,
  longitude: null,
});

const form = ref(createFreshForm());

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    form.value = props.companyData ? { ...createFreshForm(), ...props.companyData } : createFreshForm();
  }
});

const title = computed(() => (props.companyData?.id ? '编辑企业' : '新增企业'));

const save = () => {
  if (form.value.name && form.value.industry) {
    emit('save', form.value);
  } else {
    feedback.showError('请至少填写企业名称和行业。');
  }
};
</script>

<style scoped>
.form-label {
  @apply text-sm text-slate-400 block mb-1;
}
</style>