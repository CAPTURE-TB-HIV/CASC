<template>
	<div class="my-2 border col bg-white p-3">
		<div v-if="index > 0" class="d-flex flex-row-reverse">
			<button @click="removeService" class="btn btn-danger">Remove</button>
		</div>
		<div class="form-group mb-3">
			<label class="form-label">Service Name</label>
			<input v-model="service.name" type="text" placeholder="Enter service name" class="form-control" />
		</div>
		<div class="form-group mb-3">
			<label class="form-label">Description </label>
			<textarea v-model="service.description" placeholder="Enter description" class="form-control"></textarea>
			<small class="text-muted d-block">Optional description used to label outputs</small>
		</div>

		<div class="form-group mb-3" v-if="index > 0">
			<percentage-input label="Percentage of visits" help="What percentage of visits include this service"
				v-model="service.percentage">
			</percentage-input>
		</div>
		<div class="form-group mb-3" v-if="index > 0">
			<input class="form-check-input" type="checkbox" v-model="intervention.integrated" id="integration" />
			<label class="form-check-label ms-2" for="integration"> Integrated </label>
			<small class="d-block text-muted">Is this service delivered by the same staff as above?</small>
		</div>
		<div class="form-group mb-3" v-if="(index == 0) || !intervention.integrated">
			<label class="form-label">Cost per FTE</label>
			<input v-model.number="service.costPerStaff" type="number" placeholder="Enter cost" class="form-control" />
			<small class="text-muted d-block">Average annual salary for staff providing this service</small>
		</div>
		<div class="form-group mb-3">
			<label class="form-label">Minutes per service </label>
			<input v-model.number="service.minutesPerService" type="number" placeholder="Enter minutes"
				class="form-control" />
			<small class="text-muted d-block">Average number of minutes taken per service</small>
		</div>
		<div class="form-group mb-3">
			<label class="form-label"> Variable cost per service </label>
			<input v-model.number="service.variableCosts" type="number" placeholder="Enter cost" class="form-control" />
			<small class="text-muted d-block">E.g. drugs, supplies</small>
		</div>
		<div class="form-group mb-3">
			<div class="form-check">
				<input id="newServiceHasEquipment" v-model="service.hasEquipment" type="checkbox" class="form-check-input" />
				<label class="form-check-label" for="newServiceHasEquipment">Has equipment</label>
			</div>
		</div>
		<div v-if="service.hasEquipment" class="grid">
			<div class="row mb-3">
				<label>Cost per unit of equipment</label>
				<input v-model.number="service.costPerEquipment" type="number" placeholder="Enter cost" class="form-control" />
				<small class="text-muted d-block">E.g. machines, devices</small>
			</div>
			<div class="row mb-3">
				<label>Max daily services per unit of equipment</label>
				<input v-model.number="service.maxServicesPerEquipment" type="number" placeholder="Enter number"
					class="form-control" />
				<small class="text-muted">How many services could be performed in a day with a single unit</small>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import {IIntervention, IService} from "../intervention"
import PercentageInput from "./PercentageInput.vue";
import NumericInput from "./NumericInput.vue";

const emit = defineEmits<{
	(e: "removed", payload: number): void;
}>();

function removeService() {
	emit("removed", props.index);
}

const props = defineProps<{
	service: IService;
	index: number;
	intervention: IIntervention;
}>();
</script>
