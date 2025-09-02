<template>
  <div class="flex justify-center items-center min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)]">
    <div class="panel flex flex-col items-center gap-5 p-10">
      <div class="spinner"></div>
      <p class="text-lg">正在自动登录，请稍候...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    // 1. 尝试基于 token 的自动登录
    const token = localStorage.getItem('token');
    if (token) {
      authStore.setToken(token);
      await authStore.fetchUserProfile();
      if (authStore.isAuthenticated) {
        router.replace('/'); // Token 登录成功
        return; // 退出函数
      } else {
        authStore.clearAuth(); // Token 无效，清除
      }
    }

    // 2. 如果 token 登录失败或不存在 token，尝试使用内置凭据登录
    console.log('尝试使用内置账号自动登录...');
    const credentials = {
      username: '普通用户',
      password: 'Test123456'
    };
    await authStore.login(credentials);
    console.log('内置账号自动登录成功，跳转到主页...');
    router.replace('/'); // 凭据登录成功
  } catch (error) {
    console.error('自动登录失败:', error);
    authStore.clearAuth(); // 确保清除任何残留的认证状态
    router.replace('/login'); // 所有自动登录尝试失败，跳转到手动登录页
  }
});
</script>

<style>
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid var(--brand-color);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>