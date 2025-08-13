
import { ref, computed } from 'vue';

/**
 * @description 管理CRUD表单模态框的状态
 * @param {string} resourceName - 资源名称, 用于生成模态框标题 (例如: '用户', '角色')
 */
export function useCrudModal(resourceName) {
  const isFormModalOpen = ref(false);
  const selectedItem = ref(null);

  const modalTitle = computed(() => {
    const action = selectedItem.value && selectedItem.value.id ? '编辑' : '新建';
    return `${action}${resourceName}`;
  });

  /**
   * 打开模态框
   * @param {object | null} item - 要编辑的item，如果为null则为新建
   * @param {Function | undefined} prepareHook - 在设置selectedItem之前，对item进行预处理的钩子函数
   */
  function openFormModal(item, prepareHook) {
    let finalItem = item ? { ...item } : {};
    if (prepareHook && typeof prepareHook === 'function') {
      finalItem = prepareHook(finalItem);
    }
    selectedItem.value = finalItem;
    isFormModalOpen.value = true;
  }

  function closeFormModal() {
    isFormModalOpen.value = false;
    selectedItem.value = null;
  }

  return {
    isFormModalOpen,
    selectedItem,
    modalTitle,
    openFormModal,
    closeFormModal,
  };
}
