import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';
import api from '@/services/api';
import router from '@/router';
import { useDashboardStore } from './dashboardStore';
import { useMonitoringStore } from './monitoringStore';
import { useSystemManagementStore } from './systemManagementStore';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const isAutoLoginSession = ref(sessionStorage.getItem('isAutoLoginSession') === 'true' || false);

  const permissions = computed(() => user.value?.permissions || []);
  const isAuthenticated = computed(() => !!token.value);

  const hasPermission = computed(() => {
    return (requiredPermissions) => {
      if (!requiredPermissions || requiredPermissions.length === 0) return true;
      if (!permissions.value || permissions.value.length === 0) return false;
      return requiredPermissions.some(p => permissions.value.includes(p));
    };
  });

  function setToken(newToken) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }

  function setUserInfo(userInfo) {
    user.value = userInfo;
    if (userInfo) {
      localStorage.setItem('user', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('user');
    }
  }

  function setIsAutoLoginSession(isAuto) {
    isAutoLoginSession.value = isAuto;
    if (isAuto) {
      sessionStorage.setItem('isAutoLoginSession', 'true');
    } else {
      sessionStorage.removeItem('isAutoLoginSession');
    }
  }

  async function login(credentials, { redirectPath = null, isAutoLogin = false } = {}) {
    try {
      const response = await api.post('/auth/login', credentials);
      const responseData = response.data.data;
      if (!responseData || !responseData.token || !responseData.userInfo) {
        throw new Error('Invalid login response from server');
      }
      setToken(responseData.token);
      setUserInfo(responseData.userInfo);
      setIsAutoLoginSession(isAutoLogin);

      // 确保状态更新后执行跳转
      await nextTick();
      
      // 登录成功后处理重定向
      const finalRedirectPath = redirectPath || '/';
      router.replace(finalRedirectPath);

    } catch (error) {
      setToken(null);
      setUserInfo(null);
      setIsAutoLoginSession(false);
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(message);
    }
  }

  async function logout() {
    // 1. Navigate to the login page immediately.
    router.push('/login');

    // 2. Wait for the next DOM update cycle to ensure the old components are unmounted.
    await nextTick();

    // 3. Now, safely perform all cleanup operations.
    const storesToReset = [
      { name: 'dashboard', store: useDashboardStore() },
      { name: 'monitoring', store: useMonitoringStore() },
      // { name: 'chainRisk', store: useChainRiskStore() },
      { name: 'systemManagement', store: useSystemManagementStore() },
    ];

    for (const { name, store } of storesToReset) {
      if (typeof store.reset === 'function') {
        try {
          store.reset();
        } catch (e) {
          console.error(`Failed to reset store '${name}':`, e);
        }
      }
    }

    // 4. Clear local auth state.
    setToken(null);
    setUserInfo(null);
    setIsAutoLoginSession(false);

    // 5. (Optional) Notify the backend. This is the last step.
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Backend logout failed. Client-side is already logged out.', error);
    }
  }

  // Initialize API header if token exists on store creation
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  return { 
    token, 
    user, 
    permissions, 
    isAuthenticated, 
    isAutoLoginSession,
    hasPermission, 
    login, 
    logout 
  };
});
