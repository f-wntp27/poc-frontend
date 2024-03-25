import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import PrimeVue from './plugins/primevue';

import VueSweetalert2 from 'vue-sweetalert2';

import 'sweetalert2/dist/sweetalert2.min.css';
import '@fontsource/kanit';
import i18n from './i18n';

//compunents
import Loading from '@/components/Loading.vue';
import MyDataTable from '@/components/MyDataTable.vue';
import PageLayout from '@/layouts/PageLayout.vue';
// import FormField from '@/components/FormField.vue';

// directive
import Ripple from 'primevue/ripple';
import Tooltip from 'primevue/tooltip';

const app = createApp(App, { ref: 'root' }).use(router).use(PrimeVue.Config, { ripple: true });
app._context.components = {
  ...app._context.components,
  ...PrimeVue.Components,
};
app.use(PrimeVue.ToastService);
app.use(PrimeVue.ConfirmationService);
app.use(VueSweetalert2);
app.use(i18n);

app.component('Loading', Loading);
app.component('MyDataTable', MyDataTable);
app.component('PageLayout', PageLayout);
// app.component('FormField', FormField);

app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);

app.mount('#app');
