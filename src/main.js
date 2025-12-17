import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VConsole from 'vconsole'

new VConsole();
createApp(App).use(router).use(VueAxios, axios).mount('#app')
