import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/css/style.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
const app = createApp(App);
// GOOGLE LOGIN FOR GOOGLE AUTH...
import vue3GoogleLogin from 'vue3-google-login';

// CLICK OUTSIDE FOR MENUS AND DROPDOWNS...
import clickOutside from './utils/clickOutside'

// LOTTIE ANIMATIONS FOR SVGS
import Vue3Lottie from "vue3-lottie";


// CROPPER FOR PROFILE IMAGES....
import 'vue-advanced-cropper/dist/style.css';
// import 'vue-advanced-cropper/dist/theme.classic.css';


// SOCKET IO FOR REAL TIME COMMS
import VueSocketIO from 'vue-3-socket.io'
app.use(new VueSocketIO({
    connection: 'http://localhost:8000'
  }));




app.use(vue3GoogleLogin, {
    clientId: '546104205241-g4vtopr689l3vb5cfjmphard09e1ia2k.apps.googleusercontent.com'
})

app.use(Vue3Lottie);


// Declare a global variable
app.config.globalProperties.api_url = process.env.VUE_APP_API_URL;
app.config.globalProperties.msg_api_url = process.env.VUE_APP_MSG_API_URL;


app.use(store).use(router).mount('#app');

app.directive('click-outside', clickOutside)