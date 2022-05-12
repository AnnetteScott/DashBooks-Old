import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';
import { reactive } from 'vue'

export const userDict = reactive({
    "projects": {}, "clients": {}, "colours": {'colourWhite':{'name': 'Clear', 'colour': '#ffffff'}}, "users": {}, "records": {"accounts": [], "categories": {}, 'savedTransactions': {}}, "saveVersion": 13, "showGST": true, "version": '5.0.0'
})




let myApp = createApp(App)
myApp.use(Quasar, quasarUserOptions).use(router).mount('#app')



