interface WeightedItem {
	weight: number;
	value: number;
}

interface CostFunctionInputs {
	n_max: number;
	n_max_s: number | number[];
	n_max_e: number[];
	FP: number;
	FF: number;
	ST: number | number[];
	E: number[];
	V: number[];
}

interface CostResult extends CostFunctionInputs {
	totalFacilities: number;
	totalEquipment: number[];
	totalStaff: number | number[];
	totalStaffCost: number;
	totalEquipmentCost: number;
	totalProgamCost: number;
	totalFacilityCost: number;
	totalVariableCost: number;
	totalCost: number;
	averageCost: number;
}

interface ResultRow extends CostResult {
	visits: number;
}

