<template>
  <!-- 模板部分无需修改 -->
  <Transition name="page-fade">
    <div v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="panel w-full max-w-lg">
        <h2 class="panel-title">{{ title }}</h2>
        <form @submit.prevent="save" class="p-6 space-y-4">
          <!-- 用户表单 -->
          <template v-if="formType === 'user'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="text-sm text-slate-400 block mb-1">用户名</label><input type="text"
                  v-model="formData.username" required class="form-input"></div>
              <div><label class="text-sm text-slate-400 block mb-1">姓名</label><input type="text" v-model="formData.name"
                  required class="form-input"></div>
              <div><label class="text-sm text-slate-400 block mb-1">角色</label>
                <CustomSelect v-model="formData.role" :options="roles" />
              </div>
              <div><label class="text-sm text-slate-400 block mb-1">组织</label>
                <CustomSelect v-model="formData.organization" :options="organizations" />
              </div>
              <div><label class="text-sm text-slate-400 block mb-1">状态</label>
                <CustomSelect v-model="formData.status" :options="['正常', '已禁用']" />
              </div>
            </div>
          </template>
          <!-- 角色表单 -->
          <template v-if="formType === 'role'">
            <div><label class="text-sm text-slate-400 block mb-1">角色名称</label><input type="text" v-model="formData.name"
                required class="form-input"></div>
            <div><label class="text-sm text-slate-400 block mb-1">描述</label><input type="text"
                v-model="formData.description" required class="form-input"></div>
          </template>
          <!-- 组织表单 -->
          <template v-if="formType === 'org'">
            <div><label class="text-sm text-slate-400 block mb-1">组织名称</label><input type="text" v-model="formData.name"
                required class="form-input"></div>
            <div><label class="text-sm text-slate-400 block mb-1">上级组织</label>
              <CustomSelect v-model="formData.parent" :options="orgParentOptions" />
            </div>
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
import { ref, watch, computed, toRaw } from 'vue';
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

const formConfig = {
  user: {
    title: '用户',
    // 使用函数返回新对象，避免引用污染
    getDefaults: () => ({
      username: '',
      name: '',
      role: props.roles?.[0] || '',
      organization: props.organizations?.[0] || '',
      status: '正常'
    })
  },
  role: {
    title: '角色',
    getDefaults: () => ({
      name: '',
      description: '',
      permissions: []
    })
  },
  org: {
    title: '组织',
    getDefaults: () => ({
      name: '',
      parent: '-',
      manager: ''
    })
  }
};

// 这样即使 Modal 已经打开，当 itemData 变化时也能更新表单
watch(() => [props.itemData, props.formType], ([newItemData, newFormType]) => {
  // 只有当 Modal 打开时才更新表单，避免在关闭时做无用功
  if (!props.isOpen) return;

  if (newItemData) {
    // 编辑模式：和之前一样，转换并克隆
    formData.value = structuredClone(toRaw(newItemData));
  } else {
    // 新增模式：从配置对象获取默认值
    const config = formConfig[newFormType];
    formData.value = config ? config.getDefaults() : {};
  }
}, {
  deep: true,
  immediate: true // 立即执行一次，以在组件首次加载时初始化表单
});

const title = computed(() => {
  const config = formConfig[props.formType];
  if (!config) return '';
  const prefix = props.itemData?.id ? '编辑' : '新增';
  return `${prefix} ${config.title}`;
});

const save = () => {
  // 在保存时，可以考虑对 formData.value 进行一次深拷贝，避免父组件意外修改
  emit('save', structuredClone(toRaw(formData.value)));
};
</script>