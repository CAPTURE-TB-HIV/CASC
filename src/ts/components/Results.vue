<template>
  <div class="col-md-9 p-4">
    <div>
      Enter your parameters on the left, or view one of our demo use cases:<br />
      <button @click="() => setUseCase(0)" class="btn btn-primary">Scale up</button>
      <button @click="() => setUseCase(1)" class="btn btn-primary mx-2">
        New service
      </button>
      <button @click="() => setUseCase(2)" class="btn btn-primary">Integration</button>
    </div>
    <div class="row my-4">
      <div class="col">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a
              class="nav-link"
              :class="tab == 'table' ? 'active' : ''"
              @click="viewTable"
              href="#"
              >Table</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="tab == 'graphs' ? 'active' : ''"
              @click="viewGraphs"
              href="#"
              >Graphs</a
            >
          </li>
        </ul>
        <div v-if="tab == 'table'">
          <cost-function-inputs
            :intervention="intervention"
            :services="services"
            :inputs="results[0]"
          ></cost-function-inputs>
          <div class="m-3 p-3 bg-warning-subtle fs-4">
            C = FP + <span class="fs-2">&sum;</span> (n / n_max) FF +
            <span class="fs-2">&sum;</span> (n<sub>i</sub> / n_max_s<sub>i</sub>) ST<sub
              >i</sub
            >
            + <span class="fs-2">&sum;</span> (n<sub>i</sub> / n_max_e<sub>i</sub>) E<sub
              >i</sub
            >
            + <span class="fs-2">&sum;</span> (n<sub>i</sub>
            V<sub>i</sub>)
          </div>
          <h4>Costs by scale</h4>
          <table class="table table-striped">
            <thead>
              <tr>
                <th v-if="integrated">
                  Visits<br />
                  (n)
                </th>
                <th v-if="!integrated" v-for="(service, index) in services" :key="index">
                  Visits
                  <span v-text="services.length > 1 ? ' - ' + service.name : ''"></span
                  ><br />
                  (n<sub>{{ index }}</sub
                  >)
                </th>
                <th>
                  <number-of-facilities
                    :services="services"
                    :intervention="intervention"
                  ></number-of-facilities>
                </th>
                <th v-if="!integrated" v-for="(service, index) in services" :key="index">
                  Number of staff
                  <span v-text="services.length > 1 ? ' - ' + service.name : ''"></span>
                  <br />
                  (n<sub>{{ index }}</sub> / n_max_s<sub>{{ index }}</sub
                  >)
                </th>
                <th v-if="integrated">
                  Number of staff<br />
                  (n / n_max_s)
                </th>
                <template v-for="(service, index) in services">
                  <th v-if="service.hasEquipment">
                    Number of equipment
                    <span v-text="services.length > 1 ? ' - ' + service.name : ''"></span>
                    <br />
                    (n<sub>{{ index }}</sub> / n_max_e<sub>{{ index }}</sub
                    >)
                  </th>
                </template>
                <th>
                  <total-facilities-cost
                    :services="services"
                    :intervention="intervention"
                  ></total-facilities-cost>
                </th>
                <th>
                  <total-staff-costs
                    :services="services"
                    :intervention="intervention"
                  ></total-staff-costs>
                </th>
                <th>
                  <total-variable-costs
                    :services="services"
                    :intervention="intervention"
                  ></total-variable-costs>
                </th>
                <th>
                  Total cost<br />
                  &sum; (...)
                </th>
                <th>
                  <average-cost
                    :services="services"
                    :intervention="intervention"
                  ></average-cost>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(result, index) in results" :key="index">
                <td v-if="intervention.integrated">{{ formatNumber(result.visits) }}</td>
                <td
                  v-if="!intervention.integrated"
                  v-for="(service, index) in services"
                  :key="index"
                >
                  {{ formatNumber((service.percentage / 100) * result.visits) }}
                </td>
                <td>{{ formatNumber(result.totalFacilities) }}</td>
                <td
                  v-if="!intervention.integrated"
                  v-for="(result, index) in result.totalStaff"
                  :key="index"
                >
                  {{ formatNumber(result) }}
                </td>
                <td v-if="intervention.integrated">{{ result.totalStaff }}</td>

                <template v-for="(service, index) in services" :key="index">
                  <td v-if="service.hasEquipment">
                    {{ formatNumber(result.totalEquipment[index]) }}
                  </td>
                </template>
                <td>{{ formatNumber(result.totalFacilityCost) }}</td>
                <td>{{ formatNumber(result.totalStaffCost) }}</td>
                <td>{{ formatNumber(result.totalVariableCost) }}</td>
                <td>{{ formatNumber(result.totalCost) }}</td>
                <td>{{ formatNumber(result.averageCost) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="tab == 'graphs'">
          <div class="rounded-0 bg-light mt-3 form-group card">
            <div class="card-body">
              <label for="linearCost"
                >Compare to a linear cost function with average cost:</label
              >
              <div class="input-group mb-3" style="width: 200px">
                <div class="input-group-prepend">
                  <span
                    class="input-group-text"
                    style="border-top-right-radius: 0; border-bottom-right-radius: 0"
                    >$</span
                  >
                </div>
                <input
                  v-model.number="intervention.linearAverageCost"
                  name="linearCost"
                  type="number"
                  class="form-control"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          <div
            id="averageCostChart"
            ref="averageCostChart"
            height="500"
            class="d-block"
          ></div>
          <div
            id="totalCostChart"
            ref="totalCostChart"
            height="500"
            class="d-block"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { IIntervention, IService } from "../intervention";
import { numberFormatter } from "../logic";
import AverageCost from "./AverageCost.vue";
import TotalFacilitiesCost from "./TotalFacilityFixedCosts.vue";
import TotalStaffCosts from "./TotalStaffCosts.vue";
import CostFunctionInputs from "./CostFunctionInputs.vue";
import TotalVariableCosts from "./TotalVariableCosts.vue";
import NumberOfFacilities from "./NumberFacilities.vue";

// plotly provides no TS module definitions in this project; ignore the module error
// @ts-ignore
import Plotly from "plotly.js-basic-dist-min";

const props = defineProps<{
  intervention: IIntervention;
  services: IService[];
  results: ResultRow[];
}>();

const integrated = computed<boolean>(() => {
  return props.intervention.integrated || props.services.length == 1;
});

const emit = defineEmits<{
  (e: "setusecase", index: number): void;
}>();

function setUseCase(index: number) {
  emit("setusecase", index);
}

const tab = ref<"table" | "graphs">("table");

function formatNumber(value: number): string {
  return numberFormatter(value);
}

function viewTable(event: Event): void {
  event.preventDefault();
  tab.value = "table";
}

function viewGraphs(event: Event): void {
  event.preventDefault();
  tab.value = "graphs";
}

async function renderAverageCostChart(): Promise<void> {
  if (tab.value !== "graphs") return;

  await nextTick();
  const avgCostChart = document.getElementById("averageCostChart") as HTMLElement | null;
  if (!avgCostChart) return;

  const x = props.results.map((r) => r.visits);
  const avgCost = props.results.map((r) => r.averageCost);
  const avgCostLinear = props.results.map((r) => props.intervention.linearAverageCost);

  const data = [
    {
      x,
      y: avgCost,
      name: "Average cost per visit",
      mode: "lines+markers",
      type: "scatter",
    },
    {
      x,
      y: avgCostLinear,
      name: "Average cost per visit",
      mode: "lines+markers",
      type: "scatter",
    },
  ];

  const layout = {
    title: "Costs vs scale",
    height: 500,
    margin: { t: 40, r: 60, b: 50, l: 60 },
    xaxis: { type: "category", title: "Total visits per year" },
    yaxis: { title: "Average cost" },
  };

  const config = { displayModeBar: true };
  Plotly.react(avgCostChart, data, layout, config);
}

async function renderTotalCostChart(): Promise<void> {
  if (tab.value !== "graphs") return;

  await nextTick();
  const totalCostChart = document.getElementById("totalCostChart") as HTMLElement | null;
  if (!totalCostChart) return;

  const x = props.results.map((r) => r.visits);
  const totalCost = props.results.map((r) => r.totalCost);
  const totalCostLinear = props.results.map(
    (r) => r.visits * props.intervention.linearAverageCost
  );

  const data = [
    { x, y: totalCost, name: "Total cost", mode: "lines+markers", type: "scatter" },
    {
      x,
      y: totalCostLinear,
      name: "Total cost using linear cost function",
      mode: "lines+markers",
      type: "scatter",
    },
  ];

  const layout = {
    title: "Costs vs scale",
    height: 500,
    margin: { t: 40, r: 60, b: 50, l: 60 },
    xaxis: { type: "category", title: "Total visits per year" },
    yaxis: { title: "Total cost" },
  };

  const config = { displayModeBar: true };
  Plotly.react(totalCostChart, data, layout, config);
}

function renderCharts(): void {
  renderAverageCostChart();
  renderTotalCostChart();
}

watch(
  () => [props.results, props.intervention],
  () => {
    renderCharts();
  },
  { deep: true }
);

watch(tab, (newVal) => {
  if (newVal === "graphs") renderCharts();
});
</script>
