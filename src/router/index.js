import { createRouter, createWebHistory } from 'vue-router';
import CalculatorHub from '../pages/CalculatorHub.vue';
import TradingCalculator from '../components/TradingCalculator.vue';
import ForexCalculator from '../components/calculators/ForexCalculator.vue';
import IndicesCalculator from '../components/calculators/IndicesCalculator.vue';
import CryptoCalculator from '../components/calculators/CryptoCalculator.vue';
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
    path: '/calculators',
    name: 'Calculator Hub',
    component: CalculatorHub
  },
  {
    path: '/calculators/stock',
    name: 'Stock Calculator',
    component: TradingCalculator
  },
  {
    path: '/calculators/forex',
    name: 'Forex Calculator',
    component: ForexCalculator
  },
  {
    path: '/calculators/indices',
    name: 'Indices Calculator',
    component: IndicesCalculator
  },
  {
    path: '/calculators/crypto',
    name: 'Crypto Calculator',
    component: CryptoCalculator
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
