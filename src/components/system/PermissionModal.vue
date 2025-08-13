<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 -translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-4"
      >
        <!-- 模态框主面板 -->
        <div v-if="isOpen" class="w-full max-w-2xl flex flex-col bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl">
          <h2 class="panel-title text-xl font-semibold px-6 py-4">为角色 "{{ role?.name }}" 分配权限</h2>
          
          <!-- 权限树区域 -->
          <div class="px-6 py-2 border-y border-slate-700/80 overflow-y-auto custom-scrollbar" style="max-height: 60vh;">
            <div v-if="!permissionTreeData" class="text-center text-slate-400 py-10">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              正在加载权限...
            </div>
            <div v-else-if="!permissionTreeData.permissionTree || permissionTreeData.permissionTree.length === 0" class="text-center text-slate-500 py-10">
                <i class="fas fa-exclamation-circle mr-2"></i>
                没有可分配的权限。
            </div>
            <ul v-else>
              <!-- 使用 PermissionNode 组件递归渲染权限树 -->
              <PermissionNode
                v-for="node in permissionTreeData.permissionTree"
                :key="node.key"
                :node="node"
                v-model:selected-keys="selectedKeys"
              />
            </ul>
          </div>

          <!-- 底部操作按钮 -->
          <div class="flex justify-end space-x-4 p-4 bg-slate-900/30 rounded-b-xl">
            <button @click="$emit('close')" class="btn btn-secondary">取消</button>
            <button @click="save" class="btn btn-primary shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30">保存权限</button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import PermissionNode from './PermissionNode.vue'; // 引入递归子组件

const props = defineProps({
  isOpen: Boolean,
  role: Object,
  permissionTreeData: Object, // 包含 { assignedKeys, permissionTree } 的对象
});

const emit = defineEmits(['close', 'save']);

const selectedKeys = ref(new Set());

// 监听模态框的打开状态，当打开时，根据传入的 assignedKeys 初始化选中的权限
watch(() => props.isOpen, (newVal) => {
  console.log('PermissionModal received data:', JSON.stringify(props.permissionTreeData));
  if (newVal && props.permissionTreeData && props.permissionTreeData.assignedKeys) {
    selectedKeys.value = new Set(props.permissionTreeData.assignedKeys);
  } else {
    selectedKeys.value = new Set(); // Reset if no data or keys
  }
});

// 保存按钮点击事件
const save = () => {
  // 将 Set 转换为数组，并通过 'save' 事件发射出去
  emit('save', Array.from(selectedKeys.value));
};
</script>
