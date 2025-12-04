<template>
	<div class="my-3">
		<h4>Cost function inputs</h4>
		<table class="table">
			<thead>
				<tr>
					<th>
						Max visits per facility per year <br />
						<span v-if="services.length > 1 && !intervention.integrated"> (n_max<sub>0</sub>)</span>
						<span v-if="services.length == 1 || intervention.integrated"> (n_max)</span>
					</th>
					<th v-if="!intervention.integrated" v-for="(service, index) in services" :key="index">
						Max visits per FTE per year
						<input-name text="n_max_s" :services="services" :index="index"></input-name>
					</th>
					<th v-if="intervention.integrated">Max visits per FTE per year <br /> (n_max_s)</th>
					<template v-for="(service, index) in services">
						<th v-if="service.hasEquipment">
							Max visits
							per equipment per year
							<input-name text="n_max_e" :services="services" :index="index"></input-name>
						</th>
					</template>
					<th>Fixed program cost <br /> (FP)</th>
					<th>Fixed facility costs <br /> (FF)</th>
					<th v-if="!intervention.integrated" v-for="(service, index) in services" :key="index">
						Cost per FTE
						<input-name text="ST" :services="services" :index="index"></input-name>
					</th>
					<th v-if="intervention.integrated">Cost per FTE <br /> (ST)</th>
					<template v-for="(service, index) in services">
						<th v-if="service.hasEquipment">
							Cost per equipment <input-name text="E" :services="services" :index="index"></input-name>
						</th>
					</template>
					<th v-for="(service, index) in services" :key="index">
						Variable cost per service
						<input-name text="V" :services="services" :index="index"></input-name>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						{{ formatNumber(inputs.n_max) }}
					</td>
					<td v-if="!intervention.integrated" v-for="(result, idx) in inputs.n_max_s" :key="idx">
						{{ formatNumber(result) }}
					</td>
					<td v-if="intervention.integrated">
						{{ formatNumber(inputs.n_max_s as number) }}
					</td>
					<template v-for="(service, idx) in services" :key="idx">
						<td v-if="service.hasEquipment">
							{{ formatNumber(inputs.n_max_e[idx]) }}
						</td>
					</template>
					<td>
						{{ formatNumber(inputs.FP) }}
					</td>
					<td>
						{{ formatNumber(inputs.FF) }}
					</td>
					<td v-if="!intervention.integrated" v-for="(result, idx) in inputs.ST" :key="idx">
						{{ formatNumber(result) }}
					</td>
					<td v-if="intervention.integrated">
						{{ formatNumber(inputs.ST as number) }}
					</td>
					<template v-for="(service, idx) in services" :key="idx">
						<td v-if="service.hasEquipment">
							{{ formatNumber(inputs.E[idx]) }}
						</td>
					</template>
					<td v-for="(result, idx) in inputs.V" :key="idx">
						{{ formatNumber(result) }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script setup lang="ts">
import { Intervention, Service } from "../intervention"

import { numberFormatter } from '../logic';
import MaxVisitsStaff from './MaxVisitsStaff.vue';
import MaxVisitsFacility from './MaxVisitsFacility.vue';
import InputName from './InputName.vue';

function formatNumber(value: number): string {
	return numberFormatter(value);
}

defineProps<{ intervention: Intervention, services: Service[], inputs: CostFunctionInputs }>();
</script>
