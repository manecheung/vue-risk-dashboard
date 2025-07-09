<template>
  <Transition name="page-fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog" :aria-labelledby="title">
      <div class="panel w-full max-w-lg">
        <h2 :id="title" class="panel-title">{{ title }}</h2>
        <form @submit.prevent="save" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="edit-company-name" class="text-sm text-slate-400 block mb-1">企业名称</label>
              <input id="edit-company-name" type="text" v-model="form.name" required class="form-input">
            </div>
            <div>
              <label for="edit-company-industry" class="text-sm text-slate-400 block mb-1">行业</label>
              <input id="edit-company-industry" type="text" v-model="form.industry" required class="form-input">
            </div>
          </div>
          <fieldset class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <legend class="sr-only">风险等级评估</legend>
            <div>
              <label for="edit-tech-risk" class="text-sm text-slate-400 block mb-1">技术风险</label>
              <CustomSelect id="edit-tech-risk" v-model="form.tech" :options="riskLevels" />
            </div>
            <div>
              <label for="edit-finance-risk" class="text-sm text-slate-400 block mb-1">财务风险</label>
              <CustomSelect id="edit-finance-risk" v-model="form.finance" :options="riskLevels" />
            </div>
            <div>
              <label for="edit-law-risk" class="text-sm text-slate-400 block mb-1">法律风险</label>
              <CustomSelect id="edit-law-risk" v-model="form.law" :options="riskLevels" />
            </div>
            <div>
              <label for="edit-credit-risk" class="text-sm text-slate-400 block mb-1">信用风险</label>
              <CustomSelect id="edit-credit-risk" v-model="form.credit" :options="riskLevels" />
            </div>
          </fieldset>
          <div>
            <label for="edit-risk-reason" class="text-sm text-slate-400 block mb-1">核心风险事由</label>
            <input id="edit-risk-reason" type="text" v-model="form.reason" required class="form-input">
          </div>
          <div class="flex justify-end space-x-4 pt-4">
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
import CustomSelect from '@/components/common/CustomSelect.vue';
import { useFeedbackStore } from '@/stores/feedbackStore';

const props = defineProps({
  isOpen: Boolean,
  companyData: Object, // Can be null for new company
});

const emit = defineEmits(['close', 'save']);
const feedback = useFeedbackStore();

const form = ref({});
const riskLevels = ['高', '中', '低'];

const createFreshForm = () => ({
  id: null,
  name: '',
  industry: '',
  tech: '低',
  finance: '低',
  law: '低',
  credit: '低',
  reason: ''
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    form.value = props.companyData ? { ...props.companyData } : createFreshForm();
  }
});

const title = computed(() => (props.companyData?.id ? '编辑企业' : '新增企业'));

const save = () => {
  // Simple validation example
  if (form.value.name && form.value.industry && form.value.reason) {
    emit('save', form.value);
  } else {
    feedback.show('请填写所有必填项。', 'error');
  }
};
</script>