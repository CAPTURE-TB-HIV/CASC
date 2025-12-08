<template>
	<div class="row">
		<sidebar :services="state.services" :intervention="state.intervention" @addservice="addService"
			@removeservice="removeService" @savetarget="saveTarget"></sidebar>
		<results :services="state.services" :intervention="state.intervention" :results="results" @setusecase="setUseCase">
		</results>
	</div>
</template>
<script setup lang="ts">
import { Intervention, Service } from '../intervention';
import { computed, reactive } from 'vue';
import { UseCase, useCases } from '../useCases';
import { costForScale, costFunctionInputs, intermediateScales } from '../logic';

import Sidebar from './Sidebar.vue';
import Results from './Results.vue';

const state = reactive<UseCase>({
	intervention: Intervention.create({
		fixedProgram: 0,
		fixedFacility: 0,
		percFTEAllocated: 0,
		costPerStaff: 0,
		visitsPerYear: 0,
		initialFacilities: 0,
		initialStaffPerFacility: 0,
		currentVisitsPerFacility: 0,
		maxVisitsPerFacility: 0,
		maxStaffPerFacility: 0,
		capacity: "staff",
		targetVisits: 0,
		integrated: false,
		linearAverageCost: 0
	}),
	services: [Service.create({
		name: "Service One",
		costPerStaff: 0,
		minutesPerService: 0,
		variableCosts: 0,
		percentage: 100,
		hasEquipment: false,
		costPerEquipment: 0,
		training: 0,
		maxServicesPerEquipment: 0
	})]
});

function setUseCase(index: number): void {
	state.services.splice(0, state.services.length, ...useCases[index].services)
	Object.assign(state.intervention, useCases[index].intervention);
}

function addService(): void {
	state.services.push(Service.create({
		name: "New service",
		percentage: 100,
		costPerStaff: 0,
		minutesPerService: 0,
		variableCosts: 0,
		costPerEquipment: 0,
		training: 0,
		maxServicesPerEquipment: 0,
		hasEquipment: false
	}));
}

function saveTarget(value: number) {
	state.intervention.targetVisits = value;
}

function removeService(index: number): void {
	state.services.splice(index, 1);
}

const results = computed<any[]>(() => {
	const res: any[] = [];
	const initialVisits = (state.intervention.currentVisitsPerFacility * state.intervention.initialFacilities);

	//state.intervention.initialVisits 
	let visits = initialVisits;
	const inputs = costFunctionInputs(state.intervention, state.services);

	res.push({
		visits, ...costForScale(visits,
			state.intervention.initialFacilities,
			state.intervention.initialStaffPerFacility,
			state.intervention,
			state.services,
			inputs)
	});

	for (let i = 1; i < 19; i++) {
		visits = intermediateScales(visits,
			initialVisits,
			state.intervention.targetVisits,
			19);

		res.push({
			visits, ...costForScale(visits,
				state.intervention.initialFacilities,
				state.intervention.initialStaffPerFacility,
				state.intervention,
				state.services,
				inputs)
		});
	}

	res.push({
		visits: state.intervention.targetVisits,
		...costForScale(state.intervention.targetVisits,
			state.intervention.initialFacilities,
			state.intervention.initialStaffPerFacility,
			state.intervention,
			state.services,
			inputs)
	});

	return res;
});

</script>