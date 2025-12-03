import { defineComponent, reactive, ref, computed, watch, nextTick, useTemplateRef } from "vue"
// plotly provides no TS module definitions in this project; ignore the module error
// @ts-ignore
import Plotly from "plotly.js-dist-min";
import useCases from "./useCases";
import { costForScale, numberFormatter, intermediateScales, exponentialFit } from "./logic";

export default defineComponent({
	setup() {
		const tab = ref<'table' | 'graphs'>('table');
		const showTargetModal = ref<boolean>(false);
		const state = reactive<UseCase>({
			intervention: {
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
			},
			services: [{
				name: "Service One",
				costPerStaff: 0,
				minutesPerService: 0,
				variableCosts: 0,
				percentage: 100,
				hasEquipment: false,
				costPerEquipment: 0,
				training: 0,
				maxServicesPerEquipment: 0
			}]
		});

		function setUseCase(index: number): void {
			state.services.splice(0, state.services.length, ...useCases[index].services)
			Object.assign(state.intervention, useCases[index].intervention);
		}

		function addService(): void {
			state.services.push({
				name: "New service",
				percentage: 100,
				costPerStaff: 0,
				minutesPerService: 0,
				variableCosts: 0,
				costPerEquipment: 0,
				training: 0,
				maxServicesPerEquipment: 0
			} as Service);
		}

		function toggleTargetModal() {
			showTargetModal.value = !showTargetModal.value;
		}

		function saveTarget(value: number) {
			state.intervention.targetVisits = value;
		}

		function removeService(index: number): void {
			state.services.splice(index, 1);
		} showTargetModal

		function formatNumber(value: number): string {
			return numberFormatter(value);
		}

		function viewTable(event: Event): void {
			event.preventDefault();
			tab.value = 'table';
		}

		function viewGraphs(event: Event): void {
			event.preventDefault();
			tab.value = 'graphs';
		}

		const results = computed<ResultRow[]>(() => {
			const res: ResultRow[] = [];
			const initialVisits = (state.intervention.currentVisitsPerFacility * state.intervention.initialFacilities);


			//state.intervention.initialVisits 
			let visits = initialVisits;
			res.push({
				visits, ...costForScale(visits,
					state.intervention.initialFacilities,
					state.intervention.initialStaffPerFacility,
					state.intervention,
					state.services)
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
						state.services)
				});
			}

			res.push({
				visits: state.intervention.targetVisits,
				...costForScale(state.intervention.targetVisits,
					state.intervention.initialFacilities,
					state.intervention.initialStaffPerFacility,
					state.intervention,
					state.services)
			});

			return res;
		});

		async function renderAverageCostChart(): Promise<void> {
			if (tab.value !== 'graphs') return;

			await nextTick();
			const avgCostChart = document.getElementById('averageCostChart') as HTMLElement | null;
			if (!avgCostChart) return;

			const x = results.value.map(r => r.visits);
			const avgCost = results.value.map(r => r.averageCost);
			const avgCostLinear = results.value.map(r => state.intervention.linearAverageCost);

			const data = [
				{ x, y: avgCost, name: 'Average cost per visit', mode: 'lines+markers', type: 'scatter' },
				{ x, y: avgCostLinear, name: 'Average cost per visit', mode: 'lines+markers', type: 'scatter' }
			];

			const layout = {
				title: 'Costs vs scale',
				height: 500,
				margin: { t: 40, r: 60, b: 50, l: 60 },
				xaxis: { type: 'category', title: 'Total visits per year' },
				yaxis: { title: 'Average cost' }
			};

			const config = { displayModeBar: true };
			Plotly.react(avgCostChart, data, layout, config);
		}

		async function renderTotalCostChart(): Promise<void> {
			if (tab.value !== 'graphs') return;

			await nextTick();
			const totalCostChart = document.getElementById('totalCostChart') as HTMLElement | null;
			if (!totalCostChart) return;

			const x = results.value.map(r => r.visits);
			const totalCost = results.value.map(r => r.totalCost);
			const totalCostLinear = results.value.map(r => r.visits * state.intervention.linearAverageCost);

			const data = [
				{ x, y: totalCost, name: 'Total cost', mode: 'lines+markers', type: 'scatter' },
				{ x, y: totalCostLinear, name: 'Total cost using linear cost function', mode: 'lines+markers', type: 'scatter' }
			];

			const layout = {
				title: 'Costs vs scale',
				height: 500,
				margin: { t: 40, r: 60, b: 50, l: 60 },
				xaxis: { type: 'category', title: 'Total visits per year' },
				yaxis: { title: 'Total cost' }
			};

			const config = { displayModeBar: true };
			Plotly.react(totalCostChart, data, layout, config);
		}

		function renderCharts(): void {
			renderAverageCostChart();
			renderTotalCostChart();
		}

		watch([results, state], () => {
			renderCharts();
		}, { deep: true });

		watch(tab, (newVal) => {
			if (newVal === 'graphs') renderCharts();
		});
saveTarget
		return {
			tab,
			...state,
			showTargetModal,
			toggleTargetModal,
			saveTarget,
			setUseCase,
			addService,
			removeService,
			formatNumber,
			viewTable,
			viewGraphs,
			results,
			renderAverageCostChart,
			renderTotalCostChart,
			renderCharts
		};
	}
})
