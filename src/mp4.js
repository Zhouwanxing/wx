import {createApp} from 'vue'
import './style.css'
import App from './components/Chat.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

createApp(App).use(VueAxios, axios).mount('#app')