import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(null); // 可以根据需要存储用户信息

  const isAuthenticated = computed(() => !!token.value);

  function setToken(newToken) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    api.defaults.headers.common['Authorization'] = newToken ? `Bearer ${newToken}` : null;
  }

  async function login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const newToken = response.data.data.token;
      if (!newToken) {
        throw new Error('Token not found in response');
      }
      setToken(newToken);
      // 可选：获取并存储用户信息
      // user.value = await fetchUser(); 
    } catch (error) {
      setToken(null);
      const message = error.response?.data?.message || '登录失败';
      throw new Error(message);
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setToken(null);
      user.value = null;
    }
  }

  // 初始化时，如果localStorage有token，则设置请求头
  if (token.value) {
    setToken(token.value);
  }

  return { token, user, isAuthenticated, login, logout };
});
