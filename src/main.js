import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import './assets/css/style.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

import vue3GoogleLogin from 'vue3-google-login';

const app = createApp(App);


app.use(vue3GoogleLogin, {
    clientId: '546104205241-g4vtopr689l3vb5cfjmphard09e1ia2k.apps.googleusercontent.com'
})

// Declare a global variable
app.config.globalProperties.api_url = 'http://localhost:8000/api';
// app.config.globalProperties.api_url = 'https://techzone-backend-c28bd32b1555.herokuapp.com/';

app.use(store).use(router).mount('#app');
