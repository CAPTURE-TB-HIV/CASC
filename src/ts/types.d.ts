interface Service {
	name: string;
	description?: string;
	costPerStaff: number;
	minutesPerService: number;
	variableCosts: number;
	percentage: number;
	hasEquipment: boolean;
	maxServicesPerEquipment: number;
	costPerEquipment: number;
	training: number;
}

interface Intervention {
	fixedProgram: number;
	fixedFacility: number;
	percFTEAllocated: number;
	costPerStaff: number;
	visitsPerYear: number;
	initialFacilities: number;
	initialStaffPerFacility: number;
	currentVisitsPerFacility: number;
	maxVisitsPerFacility: number;
	maxStaffPerFacility: number;
	targetVisits: number;
	integrated: boolean;
	initialVisits?: number | null;
	linearAverageCost: number;
	capacity: "visits" | "staff"
}

interface UseCase {
	intervention: Intervention;
	services: Service[];
}

interface WeightedItem {
	weight: number;
	value: number;
}

interface CostResult {
	maxVisitsPerFacility: number;
	maxVisitsPerStaff: number | number[];
	maxVisitsPerEquipment: number[];
	totalFacilities: number;
	totalEquipment: number[];
	fixedProgram: number;
	fixedFacility: number;
	variableCosts: number[];
	equipmentCosts: number[];
	totalStaff: number | number[];
	staffCosts: number | number[];
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

