import Vue from 'vue'
import App from './app.vue'

Vue.component('forecast', { template: '#forecast-template' })


Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')