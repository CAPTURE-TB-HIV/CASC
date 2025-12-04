import {Intervention, Service} from "./intervention"

export const numberFormatter = new Intl.NumberFormat('en-GB', {
	maximumFractionDigits: 2
}).format;

const workdaysPerYear: number = 219;

export function visitsPerStaff(minutesPerService: number, percFTEAllocated: number): number {
	const minutesInHour = 60;
	const hoursPerDay = 8;

	// NB Excel just rounds this to nearest integer, but surely should be round down?
	const visits = Math.floor((minutesInHour / minutesPerService) *
		hoursPerDay *
		workdaysPerYear *
		(percFTEAllocated / 100));

	// if inputs are 0, this will be NaN, but we'd rather just return 0	
	return visits || 0
}

export function intermediateScales(current: number, initial: number, target: number, n: number = 19): number {
	const exponent = Math.pow(Math.log(target) / Math.log(initial), 1 / 19);
	const inner = Math.pow(current, exponent);
	const rounded = Math.ceil(inner / 100) * 100;
	return rounded;
}

export function weightedAverage(items: WeightedItem[]): number {
	let weightedSum = 0;

	for (const { weight, value } of items) {
		weightedSum += weight * value;
	}

	return weightedSum;
}

export function nSemiFixed(n: number, n_max: number) {
	return Math.ceil(n / n_max)
}

export function costFunctionInputs(
	intervention: Intervention,
	services: Service[]): CostFunctionInputs {

	let n_max_s: number | number[];
	let n_max: number;
	let ST: number | number[];

	if (intervention.percFTEAllocated > 100) {
		throw Error("More than 100% of staff allocated to the intervention")
	}

	if (intervention.integrated) {
		const minutesPerService = weightedAverage(services.map(s => ({ weight: s.proportion(), value: s.minutesPerService })));
		n_max_s = visitsPerStaff(minutesPerService, intervention.percFTEAllocated);
		n_max = intervention.n_max(n_max_s);
		ST = intervention.costPerStaff;
	} else {
		n_max_s = services.map(s => visitsPerStaff(s.minutesPerService, intervention.percFTEAllocated));
		n_max = intervention.n_max(n_max_s[0]);
		ST = services.map(s => s.costPerStaff as number);
	}

	const n_max_e = services.map(s => s.maxServicesPerEquipment * workdaysPerYear);

	return {
		n_max: n_max,
		n_max_s: n_max_s,
		n_max_e: n_max_e,
		FP: intervention.fixedProgram,
		FF: intervention.fixedFacility,
		ST: ST,
		E: services.map(s => s.costPerEquipment || 0),
		V: services.map(service => service.variableCosts)
	};
}

export function costForScale(
	n: number,
	initialFacilities: number,
	initialStaffPerFacility: number,
	intervention: Intervention,
	services: Service[],
	costFunctionInputs: CostFunctionInputs
): CostResult {

	let totalStaff: number | number[];
	let totalStaffCost = 0;

	const { n_max, n_max_s, n_max_e, ST } = costFunctionInputs;

	const totalFacilities = Math.max(initialFacilities, nSemiFixed(n, n_max));
	const initialStaff = initialStaffPerFacility * totalFacilities

	if (intervention.integrated) {
		totalStaff = Math.max(initialStaff, nSemiFixed(n, n_max_s as number))
		totalStaffCost = (totalStaff as number) * (ST as number);
	} else {
		totalStaff = services.map(s => {
			const n_i = n * s.proportion()
			const n_max_s = visitsPerStaff(s.minutesPerService, intervention.percFTEAllocated)
			return Math.max(initialStaff, nSemiFixed(n_i, n_max_s))
		})
		for (let i = 0; i < (totalStaff as number[]).length; i++) {
			totalStaffCost += (totalStaff as number[])[i] * (ST as number[])[i];
		}
	}

	const totalEquipment = services.map((s, i) => {
		if (!s.hasEquipment) return 0
		const n_i = n * s.proportion()
		const n_max_e_i = n_max_e[i]
		return Math.max(initialStaff, nSemiFixed(n_i, n_max_e_i))
	})

	const totalEquipmentCost = totalEquipment.reduce((sum, n_e, i) => {
		return sum + n_e * costFunctionInputs.E[i]
	}, 0);

	const totalVariableCost = weightedAverage(services.map(s => ({ weight: s.proportion(), value: s.variableCosts }))) * n;

	const intermediateCosts = {
		totalFacilities,
		totalEquipment,
		totalStaff,
		totalFacilityCost: totalFacilities * costFunctionInputs.FF,
		totalStaffCost,
		totalEquipmentCost,
		totalProgamCost: costFunctionInputs.FP,
		totalVariableCost
	};

	const totalCost = intermediateCosts.totalProgamCost +
		intermediateCosts.totalFacilityCost +
		intermediateCosts.totalStaffCost +
		intermediateCosts.totalEquipmentCost +
		intermediateCosts.totalVariableCost

	const averageCost = totalCost / n

	return {
		...costFunctionInputs,
		...intermediateCosts,
		totalCost,
		averageCost
	}
}
