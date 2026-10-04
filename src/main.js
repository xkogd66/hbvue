import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import LandingPage from './components/LandingPage.vue';
import DayAcrossYears from './components/DayAcrossYears.vue';
import '@fortawesome/fontawesome-free/css/all.css'
import '@/assets/tailwind.css'
import './registerServiceWorker'

const routes = [
    { path: '/', name: 'Home', component: LandingPage },
    { path: '/landing', name: 'LandingPage', component: LandingPage },
    { path: '/day/:month/:day', name: 'DayAcrossYears', component: DayAcrossYears },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

const app = createApp(App);

app.use(router);

app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info)
}

app.mount('#app');