export const numberFormatter = new Intl.NumberFormat('en-GB', {
	maximumFractionDigits: 2
}).format;

const workdaysPerYear: number = 219;

export function visitsPerStaff(minutesPerService: number, percFTEAllocated: number): number {
	const minutesInHour = 60;
	const hoursPerDay = 8;

	return Math.floor((minutesInHour / minutesPerService) *
		hoursPerDay *
		workdaysPerYear *
		(percFTEAllocated / 100));
}

export function intermediateScales(current: number, initial: number, target: number, n: number = 19): number {
	const exponent = Math.pow(Math.log(target) / Math.log(initial), 1 / 19);
	const inner = Math.pow(current, exponent);
	const rounded = Math.ceil(inner / 100) * 100;
	return rounded;
}

export function exponentialFit(x: number, xMin: number, xMax: number, yMin: number, yMax: number) {
	const b = Math.log(yMax / yMin) / (xMax - xMin);
	const a = yMin * Math.exp(-b * xMin);
	return a * Math.exp(b * x);
}

export function weightedAverageScalar(items: WeightedItem[]): number {
	let weightedSum = 0;

	for (const { weight, value } of items) {
		weightedSum += weight * value;
	}

	return weightedSum;
}

export function costForScale(
	visitsPerYear: number,
	initialFacilities: number,
	initialStaffPerFacility: number,
	intervention: Intervention,
	services: Service[]
): CostResult {

	let maxVisitsPerStaff: number | number[];
	let staffCosts: number | number[];
	let totalStaff: number | number[];
	let totalStaffCost = 0;

	if (intervention.percFTEAllocated > 100) {
		throw Error("More than 100% of staff allocated to the intervention")
	}
	let maxVisitsPerFacility = intervention.maxVisitsPerFacility;
	if (intervention.integrated) {
		const minutesPerService = weightedAverageScalar(services.map(s => ({ weight: s.percentage / 100, value: s.minutesPerService })));
		maxVisitsPerStaff = visitsPerStaff(minutesPerService, intervention.percFTEAllocated) || 0;
		if (intervention.capacity == "staff") {
			maxVisitsPerFacility = intervention.maxStaffPerFacility * maxVisitsPerStaff * intervention.percFTEAllocated
		}
	} else {
		maxVisitsPerStaff = services.map(s => visitsPerStaff(s.minutesPerService, intervention.percFTEAllocated)).map(m => m || 0);
		if (intervention.capacity == "staff") {
			maxVisitsPerFacility = intervention.maxStaffPerFacility * maxVisitsPerStaff[0]
		}
	}

	const totalFacilities = Math.max(initialFacilities, Math.ceil(visitsPerYear / maxVisitsPerFacility));

	if (intervention.integrated) {
		staffCosts = intervention.costPerStaff;
		totalStaff = Math.max(initialStaffPerFacility * totalFacilities, Math.ceil((visitsPerYear / (maxVisitsPerStaff as number))))
		totalStaffCost = (totalStaff as number) * (staffCosts as number);
	} else {

		staffCosts = services.map(s => s.costPerStaff as number);
		totalStaff = services.map(s =>
			Math.max(initialStaffPerFacility * totalFacilities, Math.ceil(((visitsPerYear * (s.percentage / 100)) / visitsPerStaff(s.minutesPerService, intervention.percFTEAllocated))))
		)
		for (let i = 0; i < (totalStaff as number[]).length; i++) {
			totalStaffCost += (totalStaff as number[])[i] * (staffCosts as number[])[i];
		}
	}

	const maxVisitsPerEquipment = services.filter(s => s.hasEquipment).map(s => (s.maxServicesPerEquipment) * workdaysPerYear);
	const totalEquipment = services.filter(s => s.hasEquipment).map(s =>
		Math.max(initialStaffPerFacility * totalFacilities, Math.ceil((visitsPerYear * (s.percentage / 100)) / ((s.maxServicesPerEquipment) * workdaysPerYear))))

	const intermediateInputs = {
		maxVisitsPerFacility,
		maxVisitsPerStaff,
		maxVisitsPerEquipment,
		totalFacilities,
		totalEquipment,
		fixedProgram: intervention.fixedProgram,
		fixedFacility: intervention.fixedFacility,
		variableCosts: services.map(service => service.variableCosts),
		equipmentCosts: services.filter(s => s.hasEquipment).map(s => s.costPerEquipment || 0),
		totalStaff,
		staffCosts
	};

	let totalVariableCost: number;

	if (intervention.integrated) {
		totalVariableCost = weightedAverageScalar(services.map(s => ({ weight: s.percentage / 100, value: s.variableCosts }))) * visitsPerYear;
	} else {
		totalVariableCost = services.map((service, i) =>
			(visitsPerYear * (service.percentage / 100) * service.variableCosts)).reduce((a, b) => a + b, 0)
	}

	let totalEquipmentCost = 0;
	for (let i = 0; i < totalEquipment.length; i++) {
		totalEquipmentCost += totalEquipment[i] * intermediateInputs.equipmentCosts[i];
	}

	const intermediateCosts = {
		totalStaffCost,
		totalEquipmentCost,
		totalProgamCost: intermediateInputs.fixedProgram,
		totalFacilityCost: intermediateInputs.totalFacilities * intervention.fixedFacility,
		totalVariableCost
	};

	const totalCost = intermediateCosts.totalProgamCost +
		intermediateCosts.totalEquipmentCost +
		intermediateCosts.totalFacilityCost +
		intermediateCosts.totalStaffCost +
		intermediateCosts.totalVariableCost

	const averageCost = totalCost / visitsPerYear

	return {
		...intermediateInputs,
		...intermediateCosts,
		totalCost,
		averageCost
	}
}
