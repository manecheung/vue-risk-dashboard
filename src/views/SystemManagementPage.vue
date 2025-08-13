<template>
  <main class="flex flex-col p-6 h-screen">
    <header class="flex-shrink-0 mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-100">系统管理</h1>
      <p class="text-slate-400 mt-1">在这里集中管理平台的用户、角色、权限和组织架构。</p>
    </header>

    <div class="flex-grow min-h-0 flex flex-col">
      <!-- 标签页导航 -->
      <div class="flex-shrink-0 border-b border-slate-700/80">
        <nav class="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            v-if="authStore.hasPermission(['system:users:manage'])"
            @click="activeTab = 'users'"
            :class="getTabClass('users')"
          >
            <i class="fas fa-users mr-2"></i>
            用户管理
          </button>
          <button
            v-if="authStore.hasPermission(['system:roles:manage'])"
            @click="activeTab = 'roles'"
            :class="getTabClass('roles')"
          >
            <i class="fas fa-user-tag mr-2"></i>
            角色管理
          </button>
          <button
            v-if="authStore.hasPermission(['system:orgs:manage'])"
            @click="activeTab = 'organizations'"
            :class="getTabClass('organizations')"
          >
            <i class="fas fa-sitemap mr-2"></i>
            组织管理
          </button>
        </nav>
      </div>

      <!-- 标签页内容 -->
      <div class="flex-grow panel mt-6 rounded-xl shadow-lg w-full p-6 overflow-y-auto custom-scrollbar">
        <div v-show="activeTab === 'users'">
          <UserManagementTab v-if="authStore.hasPermission(['system:users:manage'])" />
        </div>
        <div v-show="activeTab === 'roles'">
          <RoleManagementTab v-if="authStore.hasPermission(['system:roles:manage'])" />
        </div>
        <div v-show="activeTab === 'organizations'">
          <OrganizationManagementTab v-if="authStore.hasPermission(['system:orgs:manage'])" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const activeTab = ref('');

// 异步加载子组件以优化性能
const UserManagementTab = defineAsyncComponent(() => import('@/components/system/UserManagementTab.vue'));
const RoleManagementTab = defineAsyncComponent(() => import('@/components/system/RoleManagementTab.vue'));
const OrganizationManagementTab = defineAsyncComponent(() => import('@/components/system/OrganizationManagementTab.vue'));

// 动态计算标签页的样式
const getTabClass = (tabName) => [
  'flex items-center whitespace-nowrap py-3 px-4 border-b-2 font-semibold text-base transition-all duration-200 ease-in-out transform',
  activeTab.value === tabName
    ? 'border-sky-500 text-sky-400'
    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500',
];

// 组件挂载后，根据用户权限设置默认激活的标签页
onMounted(() => {
  if (authStore.hasPermission(['system:users:manage'])) {
    activeTab.value = 'users';
  } else if (authStore.hasPermission(['system:roles:manage'])) {
    activeTab.value = 'roles';
  } else if (authStore.hasPermission(['system:orgs:manage'])) {
    activeTab.value = 'organizations';
  }
});
</script>
