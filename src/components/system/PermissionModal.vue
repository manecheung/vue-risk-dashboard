<template>
  <Transition name="page-fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="panel w-full max-w-xl">
        <h2 class="panel-title">为角色 "{{ role?.name }}" 分配权限</h2>
        <div class="p-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-80 overflow-y-auto custom-scrollbar p-2">
            <label v-for="permission in allPermissions" :key="permission" class="flex items-center cursor-pointer">
              <input type="checkbox" :value="permission" v-model="selectedPermissions" class="form-checkbox mr-2">
              <span class="text-sm text-slate-300">{{ permission }}</span>
            </label>
          </div>
          <div class="flex justify-end space-x-4 mt-6">
            <button type="button" @click="$emit('close')" class="btn btn-secondary">取消</button>
            <button @click="save" type="button" class="btn btn-primary">保存权限</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  role: Object,
  allPermissions: Array,
  assignedPermissions: Array
});

const emit = defineEmits(['close', 'save']);

const selectedPermissions = ref([]);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Use assignedPermissions to initialize the selection
    selectedPermissions.value = props.assignedPermissions ? [...props.assignedPermissions] : [];
  }
});

const save = () => {
  emit('save', selectedPermissions.value);
};
</script>
