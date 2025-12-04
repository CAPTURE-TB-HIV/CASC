import { createApp } from 'vue';
import '../scss/styles.scss'
import AppComponent from './AppComponent';
import Service from './components/Service.vue';
import NumericInput from './components/NumericInput.vue';
import PercentageInput from './components/PercentageInput.vue';
import Target from './components/Targets.vue'
import Section from './components/Section.vue'
import TotalStaffCosts from './components/TotalStaffCosts.vue';
import NumberFacilities from './components/NumberFacilities.vue';
import TotalFacilityFixedCosts from './components/TotalFacilityFixedCosts.vue';
import TotalVariableCosts from './components/TotalVariableCosts.vue';
import AverageCost from './components/AverageCost.vue';

const app = createApp(AppComponent);
app.component("service", Service);
app.component("numericinput", NumericInput);
app.component("percentageinput", PercentageInput);
app.component("target", Target);
app.component("collapsible-section", Section);
app.component("total-staff-costs", TotalStaffCosts);
app.component("number-of-facilities", NumberFacilities);
app.component("total-facilities-cost", TotalFacilityFixedCosts);
app.component("total-variable-costs", TotalVariableCosts);
app.component("average-cost", AverageCost);
app.mount('#app');