<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <!-- 模态框主面板 -->
      <div class="panel w-full max-w-lg flex flex-col">
        <h2 class="panel-title">{{ modalTitle }}</h2>
        
        <!-- 表单区域 -->
        <form @submit.prevent="submitForm" class="p-6 space-y-4 overflow-y-auto custom-scrollbar" style="max-height: 70vh;">
          <div v-for="field in formConfig.fields" :key="field.name">
            <label :for="field.name" class="block text-sm font-medium text-slate-300 mb-1">
              {{ field.label }}
              <span v-if="field.required" class="text-red-500">*</span>
            </label>
            
            <!-- 文本/密码输入框 -->
            <input
              v-if="['text', 'password'].includes(field.type)"
              :id="field.name"
              :type="field.type"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
              v-model="formData[field.name]"
              :required="field.required"
              class="form-input w-full"
            />

            <!-- 文本域 -->
            <textarea
              v-if="field.type === 'textarea'"
              :id="field.name"
              v-model="formData[field.name]"
              :required="field.required"
              rows="3"
              class="form-input w-full"
            ></textarea>

            <!-- 下拉选择框 -->
            <select
              v-if="field.type === 'select'"
              :id="field.name"
              v-model="formData[field.name]"
              :required="field.required"
              class="form-input w-full"
            >
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>

            <!-- 复选框组 -->
            <div v-if="field.type === 'checkbox'" class="panel-light p-2 max-h-32 overflow-y-auto custom-scrollbar">
              <div v-for="option in field.options" :key="option.value" class="flex items-center my-1">
                <input
                  type="checkbox"
                  :id="`${field.name}-${option.value}`"
                  :value="option.value"
                  v-model="formData[field.name]"
                  class="h-4 w-4 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-600 focus:ring-offset-0"
                />
                <label :for="`${field.name}-${option.value}`" class="ml-2 block text-sm text-slate-300 select-none cursor-pointer">
                  {{ option.text }}
                </label>
              </div>
            </div>

            <!-- 文件输入框 -->
            <input
              v-if="field.type === 'file'"
              :id="field.name"
              type="file"
              @change="handleFileUpload($event, field.name)"
              :required="field.required"
              class="form-input w-full"
            />
          </div>
        </form>

        <!-- 底部操作按钮 -->
        <div class="flex justify-end space-x-4 p-4 bg-slate-800/50 border-t border-slate-700 rounded-b-lg">
          <button @click="closeModal" class="btn btn-secondary" :disabled="isLoading">取消</button>
          <button @click="submitForm" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading">正在保存...</span>
            <span v-else>保存</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  item: Object, // 传入的初始数据，null 或 undefined 表示新建
  formConfig: Object, // 表单配置对象
  modalTitle: String,
  isLoading: Boolean, // 新增：用于控制加载状态
});

const emit = defineEmits(['close', 'submit']);

const formData = ref({});

// 监听传入的 item 属性，当其变化时（即打开模态框或切换编辑对象时）
// 对数据进行深拷贝，以避免直接修改父组件的状态
watch(
  () => props.item,
  (newItem) => {
    formData.value = JSON.parse(JSON.stringify(newItem || {}));
  },
  { immediate: true, deep: true }
);

function closeModal() {
  emit('close');
}

function submitForm() {
  // 提交表单数据的副本
  emit('submit', { ...formData.value });
}

function handleFileUpload(event, fieldName) {
  formData.value[fieldName] = event.target.files[0];
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
