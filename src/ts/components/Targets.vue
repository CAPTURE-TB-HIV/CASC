<template>
	<div>
		<div v-if="show" class="modal-backdrop fade show" @click="onClose"></div>
		<div class="modal" tabindex="-1" :class="show ? 'show d-block' : ''">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Calculate program target</h5>
						<button type="button" class="btn-close" @click="onClose" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<numericinput v-model="state.population" label="Target population" help="Total targeted population">
						</numericinput>
						<percentageinput v-model="state.coverage" label="Target coverage"
							help="What percentage of the population will be reached">
						</percentageinput>
						<numericinput v-model="state.perCapitaTarget" label="Target annual visits per capita"
							help="Target number of annual visits per person">
						</numericinput>
						<div class="fw-bold pt-3 text-center">Target total visits: <span>{{ target }}</span> </div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" @click="onClose">Close</button>
						<button type="button" class="btn btn-primary" @click="onClick">Save target</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

const state = reactive({
	coverage: 0,
	population: 0,
	perCapitaTarget: 0
});

const emit = defineEmits<{
	(e: "save", value: number): void;
	(e: "close"): void;
}>();

function onClick() {
	emit("save", Math.ceil(state.coverage * state.population * state.perCapitaTarget))
}

function onClose() {
	emit("close")
}

const target = computed(() => {
	return Math.ceil(state.coverage * state.population * state.perCapitaTarget)
});

const props = defineProps<{
	show: boolean,
	intervention: Intervention;
}>();

</script>