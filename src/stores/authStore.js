import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  // 直接从 localStorage 初始化状态
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  
  // 权限可以从用户对象中派生出来
  const permissions = computed(() => user.value?.permissions || []);
  const isAuthenticated = computed(() => !!token.value);

  /**
   * 检查当前用户是否拥有一组给定的权限。
   * @param {string[]} requiredPermissions - 需要检查的权限键数组。
   * @returns {boolean} - 如果用户至少拥有其中一个所需权限，则返回 true。
   */
  const hasPermission = computed(() => {
    return (requiredPermissions) => {
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true; // 不需要特定权限
      }
      if (!permissions.value || permissions.value.length === 0) {
        return false; // 用户没有任何权限
      }
      // 检查所需权限中是否至少有一个存在于用户的权限列表中
      return requiredPermissions.some(p => permissions.value.includes(p));
    };
  });

  /**
   * 在 state、localStorage 和 API 请求头中设置认证令牌。
   * @param {string | null} newToken - 新的令牌，或传入 null 来清除它。
   */
  function setToken(newToken) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
      // 为所有后续的 API 请求设置认证头
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      // 移除认证头
      delete api.defaults.headers.common['Authorization'];
    }
  }

  /**
   * 在 state 和 localStorage 中设置用户信息。
   * @param {object | null} userInfo - 用户信息对象，或传入 null 来清除它。
   */
  function setUserInfo(userInfo) {
    user.value = userInfo;
    if (userInfo) {
      localStorage.setItem('user', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('user');
    }
  }

  /**
   * 通过调用后端来登录用户，然后设置令牌和用户信息。
   * @param {object} credentials - 用户的登录凭据 ({ username, password })。
   */
  async function login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const responseData = response.data.data;

      if (!responseData || !responseData.token || !responseData.userInfo) {
        throw new Error('从服务器返回的登录响应无效');
      }

      // 从登录响应中设置令牌和用户信息
      setToken(responseData.token);
      setUserInfo(responseData.userInfo);

    } catch (error) {
      // 登录失败时清除任何过时的认证数据
      setToken(null);
      setUserInfo(null);
      const message = error.response?.data?.message || '登录失败，请检查您的用户名和密码。';
      throw new Error(message);
    }
  }

  /**
   * 登出用户，清除所有存储的认证数据，并重定向到登录页面。
   * @param {boolean} [notifyBackend=true] - 是否向后端发送登出请求。
   */
  async function logout(notifyBackend = true) {
    if (notifyBackend && token.value) {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('后端登出失败，继续执行客户端登出。', error);
        }
    }
    
    // 无论后端响应如何，都清除所有认证状态
    setToken(null);
    setUserInfo(null);
    
    // 重定向到登录页面
    // 使用 setTimeout 确保在路由改变前状态更新已完成
    setTimeout(() => {
        router.push('/login');
    }, 0);
  }

  // ---- 初始化 ----
  // 当 store 创建时，如果 localStorage 中存在令牌，
  // 则确保 API 请求头已设置。用户信息已从 localStorage 加载。
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  return { 
    token, 
    user, 
    permissions, 
    isAuthenticated, 
    hasPermission, 
    login, 
    logout 
  };
});