import { createRouter, createWebHistory } from 'vue-router';
import TradingCalculator from '../components/TradingCalculator.vue';
import TradingTiming from '../components/TradingTiming.vue';
import Home from '../pages/Home.vue';
import Checklist from '../pages/Checklist.vue';
import Strategies from '../pages/Strategies.vue';
import TradingJournal from '../pages/TradingJournal.vue';
import AccountSettings from '../pages/AccountSettings.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/trading-calculator',
    name: 'Trading Calculator',
    component: TradingCalculator
  },
  {
    path: '/trading-timing',
    name: 'Trading Timing',
    component: TradingTiming
  },
  {
    path: '/strategies',
    name: 'Strategies',
    component: Strategies
  },
  {
    path: '/checklist',
    name: 'Checklist',
    component: Checklist
  },
  {
    path: '/trading-journal',
    name: 'Trading Journal',
    component: TradingJournal
  },
  {
    path: '/account-settings',
    name: 'Account Settings',
    component: AccountSettings
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
