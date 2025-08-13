
import { ref, computed } from 'vue';
import { useSystemManagementStore } from '@/stores/systemManagementStore';
import { useFeedbackStore } from '@/stores/feedbackStore';

/**
 * @description 可复用的通用管理逻辑 (CRUD)
 * @param {object} options - 配置选项
 * @param {string} options.resourceName - 资源名称 (例如: '用户', '角色')
 * @param {string} options.resourceKey - store中的资源key (例如: 'users', 'roles')
 * @param {Function} options.fetchAction - 获取数据的action
 * @param {Function} options.createAction - 创建资源的action
 * @param {Function} options.updateAction - 更新资源的action
 * @param {Function} options.deleteAction - 删除资源的action
 * @param {Array} options.columns - DataTable的列定义
 * @param {Array} options.formFields - FormModal的表单字段定义
 */
export function useManagement(options) {
  const {
    resourceName,
    resourceKey,
    fetchAction,
    createAction,
    updateAction,
    deleteAction,
    columns,
    formFields,
  } = options;

  const systemStore = useSystemManagementStore();
  const feedbackStore = useFeedbackStore();

  const items = computed(() => systemStore[resourceKey]);

  const isModalVisible = ref(false);
  const isConfirmModalVisible = ref(false);
  const currentItem = ref(null);
  const isEditMode = ref(false);

  const modalTitle = computed(() => {
    if (!currentItem.value) return `创建${resourceName}`;
    return isEditMode.value ? `编辑${resourceName}` : `查看${resourceName}详情`;
  });

  // 获取数据
  systemStore[fetchAction]();

  // 打开创建模态框
  const handleCreate = () => {
    currentItem.value = {};
    isEditMode.value = true;
    isModalVisible.value = true;
  };

  // 打开编辑模态框
  const handleEdit = (item) => {
    currentItem.value = { ...item };
    isEditMode.value = true;
    isModalVisible.value = true;
  };
  
  // 打开查看详情模态框
  const handleView = (item) => {
    currentItem.value = { ...item };
    isEditMode.value = false;
    isModalVisible.value = true;
  };

  // 打开删除确认模态框
  const handleDelete = (item) => {
    currentItem.value = item;
    isConfirmModalVisible.value = true;
  };

  // 提交表单 (创建或更新)
  const handleSubmit = async (formData) => {
    try {
      if (formData.id) {
        await systemStore[updateAction](formData.id, formData);
        feedbackStore.showFeedback(`🎉 ${resourceName}更新成功！`, 'success');
      } else {
        await systemStore[createAction](formData);
        feedbackStore.showFeedback(`🎉 ${resourceName}创建成功！`, 'success');
      }
      isModalVisible.value = false;
      systemStore[fetchAction](); // 重新获取数据
    } catch (error) {
      console.error(`处理${resourceName}失败:`, error);
      feedbackStore.showFeedback(`😥 操作失败: ${error.message}`, 'error');
    }
  };

  // 确认删除
  const confirmDelete = async () => {
    if (!currentItem.value) return;
    try {
      await systemStore[deleteAction](currentItem.value.id);
      feedbackStore.showFeedback(`🗑️ ${resourceName}删除成功！`, 'success');
      isConfirmModalVisible.value = false;
      systemStore[fetchAction](); // 重新获取数据
    } catch (error) {
      console.error(`删除${resourceName}失败:`, error);
      feedbackStore.showFeedback(`😥 删除失败: ${error.message}`, 'error');
    }
  };

  return {
    items,
    columns,
    formFields,
    isModalVisible,
    isConfirmModalVisible,
    currentItem,
    isEditMode,
    modalTitle,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleSubmit,
    confirmDelete,
  };
}
