<template>
  <div class="flex items-center justify-center min-h-screen app-container">
    <div class="w-full max-w-xl p-8 space-y-8 bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl">
      <div class="text-center">
        <!-- <img src="/dec.svg" alt="Logo" class="w-16 h-16 mx-auto mb-4" /> -->
        <h2 class="text-3xl font-bold text-white">风电产业链风险预警数据中心</h2>
      </div>
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="username" class="block text-sm font-medium text-slate-300">用户名</label>
          <div class="mt-1">
            <input id="username" v-model="username" name="username" type="text" required
                   class="w-full px-3 py-2 text-white bg-gray-800/60 border border-slate-700 rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-slate-300">密码</label>
          <div class="mt-1">
            <input id="password" v-model="password" name="password" type="password" required
                   class="w-full px-3 py-2 text-white bg-gray-800/60 border border-slate-700 rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
          </div>
        </div>

        <div v-if="error" class="text-sm text-red-400 text-center">
          {{ error }}
        </div>

        <div>
          <button type="submit" :disabled="isLoading"
                  class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-60 transition-all duration-200 ease-in-out transform hover:scale-105">
            <span v-if="isLoading">登录中...</span>
            <span v-else>登 录</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const username = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const route = useRoute();
const authStore = useAuthStore();

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const redirectPath = route.query.redirect || '/';
    await authStore.login({ username: username.value, password: password.value }, { redirectPath: redirectPath });
  } catch (err) {
    error.value = err.message || '登录失败，请检查用户名和密码。';
  } finally {
    isLoading.value = false;
  }
};
</script>
