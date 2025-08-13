import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/LoginPage.vue'), meta: { title: '登录', public: true } },
  { path: '/', name: 'dashboard', component: () => import('../views/DashboardPage.vue'), meta: { title: '首页看板' } },
  { path: '/monitoring', name: 'monitoring', component: () => import('../views/MonitoringListPage.vue'), meta: { title: '网络信息监测' } },
  { path: '/news/:id', name: 'newsDetail', component: () => import('../views/NewsDetailPage.vue'), props: true, meta: { title: '要闻详情' } },
  { path: '/risk/:id', name: 'riskDetail', component: () => import('../views/RiskDetailPage.vue'), props: true, meta: { title: '风险详情' } },
  { path: '/chain-risk', name: 'chain-risk', component: () => import('../views/ChainRiskPage.vue'), meta: { title: '产业链风险预警' } },
  { path: '/supply-chain', name: 'supply-chain', component: () => import('../views/SupplyChainPage.vue'), meta: { title: '供应链风险评估' } },
  { path: '/system-management', name: 'system-management', component: () => import('../views/SystemManagementPage.vue'), meta: { title: '系统管理' } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../components/common/PlaceholderPage.vue'), props: { pageTitle: '页面未找到' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = !to.meta.public;

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else if (!requiresAuth && authStore.isAuthenticated && to.name === 'login') {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title ? `产业链风险预警系统 - ${to.meta.title}` : '产业链风险预警系统';
});

export default router;