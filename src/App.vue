<template>
  <div class="app-container">
    <header class="main-header" :class="{ 'header-hidden': isHeaderHidden }">
      <div class="flex items-center">
        <img src="/dec.svg" alt="Logo" class="h-8 w-8 rounded-full" />
        <h1 class="text-lg font-semibold ml-3 text-white">产业链风险预警系统</h1>
      </div>
      <nav class="hidden md:flex items-center space-x-6" aria-label="主导航">
        <router-link v-for="page in mainNav" :key="page.id" :to="page.path"
          class="text-sm font-medium px-2 py-1 rounded transition-colors"
          :class="[page.path === activeNavPath ? 'text-sky-400 bg-sky-500/10' : 'text-slate-400 hover:text-white']">
          {{ page.title }}
        </router-link>
      </nav>
      <div class="flex items-center space-x-4">
        <span class="hidden sm:block text-sm text-slate-500">{{ new Date().toLocaleDateString('zh-CN', {
          year:
            'numeric', month: 'long', day: 'numeric'
        }) }}</span>
        <div class="flex items-center space-x-2">
          <img src="/A.svg" class="h-8 w-8 rounded-full" alt="用户头像" />
          <span class="hidden lg:block text-sm font-medium text-slate-300">Admin</span>
        </div>
      </div>
    </header>

    <main class="transition-all duration-300 h-screen" :style="{ paddingTop: isHeaderHidden ? '0' : '4rem' }">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <FeedbackToast />
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import FeedbackToast from '@/components/common/FeedbackToast.vue';

const isHeaderHidden = ref(false);
const route = useRoute();

const HEADER_HIDE_THRESHOLD = 80;

const mainNav = [
  { id: 'dashboard', path: '/', title: '首页看板' },
  { id: 'monitoring', path: '/monitoring', title: '网络信息监测' },
  { id: 'chain-risk', path: '/chain-risk', title: '产业链风险预警' },
  { id: 'supply-chain', path: '/supply-chain', title: '供应链风险评估' },
  { id: 'system-management', path: '/system-management', title: '系统管理' }
];

const activeNavPath = computed(() => {
  const currentPath = route.path;
  if (currentPath === '/') return '/';

  for (let i = mainNav.length - 1; i >= 0; i--) {
    const navPath = mainNav[i].path;
    if (navPath !== '/' && currentPath.startsWith(navPath)) {
      return navPath;
    }
  }
  return '/';
});


const handleMouseMove = (event) => {
  isHeaderHidden.value = event.clientY > HEADER_HIDE_THRESHOLD;
};

watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    isHeaderHidden.value = true;
    window.addEventListener('mousemove', handleMouseMove);
  } else {
    isHeaderHidden.value = false;
    window.removeEventListener('mousemove', handleMouseMove);
  }
}, { immediate: true });

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

.app-container {
  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-primary);
  background-image:
    radial-gradient(ellipse 80% 80% at 50% -20%, rgba(12, 74, 110, 0.3), transparent),
    radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.1), transparent 40%),
    radial-gradient(circle at 75% 75%, rgba(56, 189, 248, 0.1), transparent 40%);
}

.main-header {
  background-color: var(--panel-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: transform 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 1.5rem;
}


.header-hidden {
  transform: translateY(-100%);
}

.dashboard-header {
  height: 50px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.header-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.2em;
  text-shadow: 0 0 10px var(--glow-color), 0 0 20px var(--glow-color);
  position: relative;
  z-index: 10;
  padding: 0 2rem;
}

.dashboard-header::before,
.dashboard-header::after {
  content: '';
  position: absolute;
  top: 50%;
  height: 2px;
  width: 35%;
  background: linear-gradient(to right, transparent, var(--glow-color), transparent);
  animation: pulse-line 3s infinite ease-in-out;
}

.dashboard-header::before {
  right: 50%;
  margin-right: 18rem;
}

.dashboard-header::after {
  left: 50%;
  margin-left: 18rem;
  animation-delay: -1.5s;
}

@keyframes pulse-line {

  0%,
  100% {
    opacity: 0.5;
    transform: scaleX(0.8);
  }

  50% {
    opacity: 1;
    transform: scaleX(1);
  }
}

.scan-light {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right,
      transparent 0%,
      rgba(56, 189, 248, 0.2) 48%,
      rgba(56, 189, 248, 0.5) 50%,
      rgba(56, 189, 248, 0.2) 52%,
      transparent 100%);
  animation: scan-effect 5s linear infinite;
  pointer-events: none;
}

@keyframes scan-effect {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.bottom-line {
  position: absolute;
  bottom: 0px;
  left: 100px;
  right: 100px;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--border-color) 20%, var(--border-color) 80%, transparent);
}

.corner-decorator {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid var(--glow-color);
  opacity: 0.8;
}

.corner-decorator.top-left {
  top: 0px;
  left: 0px;
  border-right: none;
  border-bottom: none;
}

.corner-decorator.top-right {
  top: 0px;
  right: 0px;
  border-left: none;
  border-bottom: none;
}

.corner-decorator.bottom-left {
  bottom: 0px;
  left: 0px;
  border-right: none;
  border-top: none;
}

.corner-decorator.bottom-right {
  bottom: 0px;
  right: 0px;
  border-left: none;
  border-top: none;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: transparent;
  transition: background-color 0.3s ease-in-out;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: rgba(56, 189, 248, 0.4);
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb:hover {
  background: rgba(56, 189, 248, 0.6);
}

.panel-simple::before,
.panel-simple::after {
  content: none;
}
</style>