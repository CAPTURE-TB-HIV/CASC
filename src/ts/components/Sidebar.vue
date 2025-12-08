<template>
	<div class="col-md-3 bg-light p-4" style="min-height: calc(100vh - 120px); border-right: 1px solid #ddd;">
		<collapsible-section title="Program characteristics">
			<numeric-input v-model.number="intervention.initialFacilities" label="Initial number of facilities"
				help="Facilities initially providing the intervention"></numeric-input>
			<numeric-input v-model="intervention.targetVisits" label="Target annual visits">
				<small class="text-muted">A total national target can be provided directly, or <a href="#"
						style="margin-top: -2px" @click="toggleTargetModal">calculate target from population and
						coverage</a></small>
			</numeric-input>
			<target :show="showTargetModal" :intervention="intervention" @save="saveTarget" @close="toggleTargetModal">
			</target>
			<numeric-input v-model="intervention.fixedProgram" label="Fixed program costs"
				help="Total fixed costs at the above-facility level"> </numeric-input>
		</collapsible-section>
		<collapsible-section title="Facility characteristics">

			<numeric-input v-model.number="intervention.initialStaffPerFacility" label="Initial staff per facility"
				help="Average number of staff employed by each facility, even if they are not fully allocated to this intervention">
			</numeric-input>
			<numeric-input v-model.number="intervention.currentVisitsPerFacility" label="Initial annual visits per facility"
				help="Initial average annual number of intervention visits per facility"> </numeric-input>
			<div class="form-group mb-3">
				<label>Specify capacity by:</label>
				<select class="form-select" v-model="intervention.capacity">
					<option value="visits">Max visits</option>
					<option value="staff">Max staff</option>
				</select>
				<small class="text-muted">If max staff is provided, max visits will be calculated from the length of a
					visit, the working
					minutes available in a year, and the % FTE allocated to the intervention</small>
			</div>
			<numeric-input v-if="intervention.capacity == 'visits'" v-model.number="intervention.maxVisitsPerFacility"
				label="Max annual visits per facility">
			</numeric-input>
			<numeric-input v-if="intervention.capacity == 'staff'" v-model.number="intervention.maxStaffPerFacility"
				label="Max staff per facility" help="Maximum number of staff employable per facility">
			</numeric-input>
			<percentage-input label="% staff allocated to intervention" v-model.number="intervention.percFTEAllocated"
				help="What percentage of staff time is allocated to this intervention">
			</percentage-input>
			<numeric-input v-model.number="intervention.fixedFacility" label="Fixed facility costs"
				help="Fixed cost per facility, e.g. buildings, utilities, maintenance"></numeric-input>
		</collapsible-section>
		<collapsible-section title="Services">
			<div class="row">
				<div v-for="(service, index) in services" :key="index">
					<service :service="service" :index="index" :intervention="intervention"
						@removed="() => removeService(index)" />
				</div>
			</div>
			<div class="row">
				<div class="col">
					<div style="display: flex; gap: 10px;">
						<button @click="addService" class="btn btn-primary">Add another service</button>
					</div>
				</div>
			</div>
		</collapsible-section>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { IIntervention, IService } from '../intervention';
import NumericInput from "./NumericInput.vue";
import CollapsibleSection from "./Section.vue";
import Service from "./Service.vue";
import Target from "./Target.vue";
import PercentageInput from "./PercentageInput.vue";

defineProps<{ intervention: IIntervention, services: IService[] }>();

const showTargetModal = ref<boolean>(false);
function toggleTargetModal() {
	showTargetModal.value = !showTargetModal.value;
}

const emit = defineEmits<{
	(e: 'addservice'): void,
	(e: 'removeservice', index: number): void,
	(e: 'savetarget', value: number): void
}>()

function addService() {
	emit('addservice')
}

function removeService(index: number) {
	emit('removeservice', index)
}

function saveTarget(value: number) {
	emit('savetarget', value)
}
</script>