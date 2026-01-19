import { createRouter, createWebHistory } from 'vue-router';
import TradingCalculator from '../components/TradingCalculator.vue';
import TradingScheduleItaly from '../components/TradingScheduleItaly.vue';
import Home from '../pages/Home.vue';
import Checklist from '../pages/Checklist.vue';

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
    path: '/trading-schedule-italy',
    name: 'Trading Schedule Italy',
    component: TradingScheduleItaly
  },
  {
    path: '/checklist',
    name: 'Checklist',
    component: Checklist
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
