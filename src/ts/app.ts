import { createApp } from 'vue';
import '../scss/styles.scss'
import AppComponent from './AppComponent';
import Service from './components/Service.vue';
import NumericInput from './components/NumericInput.vue';
import PercentageInput from './components/PercentageInput.vue';
import Target from './components/Targets.vue'
import Section from './components/Section.vue'

const app = createApp(AppComponent);
app.component("service", Service);
app.component("numericinput", NumericInput);
app.component("percentageinput", PercentageInput);
app.component("target", Target);
app.component("collapsible-section", Section);
app.mount('#app');
