import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import AutoLoginPage from '../views/AutoLoginPage.vue'; // 新增的导入

const routes = [
  // 公开路由：登录页
  { 
    path: '/login', 
    name: 'login', 
    component: () => import('../views/LoginPage.vue'), 
    meta: { title: '登录', public: true } 
  },
  // 新增的自动登录路由
  {
    path: '/auto-login',
    name: 'AutoLogin',
    component: AutoLoginPage,
    meta: { title: '自动登录', public: true } // 标记为公开路由，无需认证
  },
  
  // 需要认证和权限的业务路由
  { 
    path: '/', 
    name: 'dashboard', 
    component: () => import('../views/DashboardPage.vue'), 
    meta: { 
      title: '首页看板', 
      requiresAuth: true,
      permissions: ['dashboard:view'] // 需要 'dashboard:view' 权限
    } 
  },
  { 
    path: '/monitoring', 
    name: 'monitoring', 
    component: () => import('../views/MonitoringListPage.vue'), 
    meta: { 
      title: '网络信息监测', 
      requiresAuth: true,
      permissions: ['monitoring:view'] // 需要 'monitoring:view' 权限
    } 
  },
  { 
    path: '/monitoring/news/:id', 
    name: 'newsDetail', 
    component: () => import('../views/NewsDetailPage.vue'), 
    props: true, 
    meta: { 
      title: '要闻详情', 
      requiresAuth: true,
      permissions: ['monitoring:view'] // 继承列表页的查看权限
    } 
  },
  { 
    path: '/monitoring/risk/:id', 
    name: 'riskDetail', 
    component: () => import('../views/RiskDetailPage.vue'), 
    props: true, 
    meta: { 
      title: '风险详情', 
      requiresAuth: true,
      permissions: ['monitoring:view'] // 继承列表页的查看权限
    } 
  },
  {
    path: '/material-prices',
    name: 'material-prices',
    component: () => import('../views/MaterialPricePage.vue'),
    meta: {
      title: '原材料价格监测',
      requiresAuth: true,
      permissions: ['materials:view']
    }
  },
  { 
    path: '/chain-risk', 
    name: 'chain-risk', 
    component: () => import('../views/ChainRiskPage.vue'), 
    meta: { 
      title: '产业链风险预警', 
      requiresAuth: true,
      permissions: ['chain-risk:view'] // 需要 'chain-risk:view' 权限
    } 
  },
  { 
    path: '/supply-chain', 
    name: 'supply-chain', 
    component: () => import('../views/SupplyChainPage.vue'), 
    meta: { 
      title: '供应链风险评估', 
      requiresAuth: true,
      permissions: ['supply-chain:view'] // 需要 'supply-chain:view' 权限
    } 
  },
  { 
    path: '/system-management', 
    name: 'system-management', 
    component: () => import('../views/SystemManagementPage.vue'), 
    meta: { 
      title: '系统管理', 
      requiresAuth: true,
      // 复合权限：用户需要拥有以下至少一个权限才能访问
      permissions: ['system:users:manage', 'system:roles:manage', 'system:orgs:manage'] 
    } 
  },
  {
    path: '/analysis-model',
    name: 'analysis-model',
    component: () => import('../views/UestcGraphPage.vue'),
    meta: {
      title: '产品图谱与模型',
      requiresAuth: true,
      permissions: ['uestc-graph:view', 'model-management:view']
    }
  },
  {
    path: '/risk-propagation',
    name: 'risk-propagation',
    component: () => import('../views/RiskPropagationPage.vue'),
    meta: {
      title: '产业链风险模拟',
      requiresAuth: true,
      permissions: ['chain-risk:manage']
    }
  },

  // 辅助路由
  { 
    path: '/403', 
    name: 'Forbidden', 
    component: () => import('../components/common/PlaceholderPage.vue'), 
    props: { pageTitle: '无权访问', message: '抱歉，您没有权限访问此页面。' },
    meta: { public: true }
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: () => import('../components/common/PlaceholderPage.vue'), 
    props: { pageTitle: '页面未找到' } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;

  // 1. 如果目标路由需要认证
  if (requiresAuth) {
    // 1.1 但用户未登录
    if (!authStore.isAuthenticated) {
      // 重定向到登录页，并附带原始目标地址，以便登录后跳转回来
      next({ name: 'login', query: { redirect: to.fullPath } });
    } else {
      // 1.2 用户已登录，检查页面是否需要特定权限
      const requiredPermissions = to.meta.permissions;
      if (requiredPermissions && requiredPermissions.length > 0) {
        // 检查用户是否拥有所需权限中的至少一个
        if (authStore.hasPermission(requiredPermissions)) {
          next(); // 有权限，放行
        } else {
          next({ name: 'Forbidden' }); // 无权限，重定向到403页面
        }
      } else {
        next(); // 页面不需要特定权限，直接放行
      }
    }
  } else {
    // 2. 如果目标路由是公开的 (例如登录页)
    // 2.1 如果用户已登录，且目标是登录页，则直接跳转到首页，避免重复登录
    if (to.name === 'login' && authStore.isAuthenticated) {
      next({ name: 'dashboard' });
    } else {
      next(); // 其他情况（未登录访问公共页面），直接放行
    }
  }
});

// 全局后置钩子，用于更新页面标题
router.afterEach((to) => {
  document.title = to.meta.title ? `产业链风险预警系统 - ${to.meta.title}` : '产业链风险预警系统';
});

export default router;
