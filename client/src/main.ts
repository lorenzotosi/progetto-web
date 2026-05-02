import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router';
import {useAuthStore} from "./stores/auth.store.ts";
import {socketService} from "./services/socket.service.ts";

const app = createApp(App)

app.use(createPinia())
app.use(router)
const authStore = useAuthStore();
if (authStore.isAuthenticated() && authStore.token) {
    socketService.connect(authStore.token);
}

app.mount('#app')
