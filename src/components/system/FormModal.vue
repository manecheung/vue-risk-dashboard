<template>
  <Transition name="page-fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="panel w-full max-w-lg">
        <h2 class="panel-title">{{ title }}</h2>
        <form @submit.prevent="save" class="p-6 space-y-4">
          <!-- 用户表单 -->
          <template v-if="formType === 'user'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="text-sm text-slate-400 block mb-1">用户名</label><input type="text" v-model="formData.username" required class="form-input"></div>
              <div><label class="text-sm text-slate-400 block mb-1">姓名</label><input type="text" v-model="formData.name" required class="form-input"></div>
              <div><label class="text-sm text-slate-400 block mb-1">角色</label><CustomSelect v-model="formData.role" :options="roles" /></div>
              <div><label class="text-sm text-slate-400 block mb-1">组织</label><CustomSelect v-model="formData.organization" :options="organizations" /></div>
              <div><label class="text-sm text-slate-400 block mb-1">状态</label><CustomSelect v-model="formData.status" :options="['正常', '已禁用']" /></div>
            </div>
          </template>
          <!-- 角色表单 -->
          <template v-if="formType === 'role'">
            <div><label class="text-sm text-slate-400 block mb-1">角色名称</label><input type="text" v-model="formData.name" required class="form-input"></div>
            <div><label class="text-sm text-slate-400 block mb-1">描述</label><input type="text" v-model="formData.description" required class="form-input"></div>
          </template>
          <!-- 组织表单 -->
          <template v-if="formType === 'org'">
              <div><label class="text-sm text-slate-400 block mb-1">组织名称</label><input type="text" v-model="formData.name" required class="form-input"></div>
              <div><label class="text-sm text-slate-400 block mb-1">上级组织</label><CustomSelect v-model="formData.parent" :options="orgParentOptions" /></div>
              <div><label class="text-sm text-slate-400 block mb-1">负责人</label>
                <CustomSelect v-model="formData.manager" :options="userOptions" placeholder="请选择负责人" />
              </div>
          </template>

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

const props = defineProps({
  isOpen: Boolean,
  formType: String,
  itemData: Object,
  roles: Array,
  organizations: Array,
  orgParentOptions: Array,
  userOptions: Array
});

const emit = defineEmits(['close', 'save']);

const formData = ref({});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    formData.value = structuredClone(
      props.itemData ||
      (props.formType === 'user' ? { username: '', name: '', role: props.roles[0], organization: props.organizations[0], status: '正常' } :
        (props.formType === 'role' ? { name: '', description: '', permissions: [] } :
          { name: '', parent: '-', manager: '' }))
    );
  }
});

const title = computed(() => {
  const titles = { user: '用户', role: '角色', org: '组织' };
  return (props.itemData?.id ? '编辑' : '新增') + (titles[props.formType] || '');
});

const save = () => { emit('save', formData.value); };
</script>
