
export class Service implements IService {

	proportion() {
		return this.percentage / 100;
	}

	constructor(
		public name: string,
		public costPerStaff: number,
		public minutesPerService: number,
		public variableCosts: number,
		public percentage: number,
		public hasEquipment: boolean,
		public maxServicesPerEquipment: number,
		public costPerEquipment: number,
		public training: number,
		public description?: string
	) { }

	static create(props: {
		name: string,
		costPerStaff: number,
		minutesPerService: number,
		variableCosts: number,
		percentage: number,
		hasEquipment: boolean,
		maxServicesPerEquipment: number,
		costPerEquipment: number,
		training: number,
		description?: string
	}) {
		return new Service(
			props.name,
			props.costPerStaff,
			props.minutesPerService,
			props.variableCosts,
			props.percentage,
			props.hasEquipment,
			props.maxServicesPerEquipment,
			props.costPerEquipment,
			props.training,
			props.description,
		);
	}

	n(visits: number): number {
		return (this.percentage / 100) * visits
	}

}

export class Intervention implements IIntervention {

	constructor(
		public fixedProgram: number,
		public fixedFacility: number,
		public percFTEAllocated: number,
		public costPerStaff: number,
		public visitsPerYear: number,
		public initialFacilities: number,
		public initialStaffPerFacility: number,
		public currentVisitsPerFacility: number,
		public maxVisitsPerFacility: number,
		public maxStaffPerFacility: number,
		public targetVisits: number,
		public integrated: boolean,
		public linearAverageCost: number,
		public capacity: "visits" | "staff",
		public initialVisits?: number | null
	) { }

	n_max(n_max_s: number) {
		if (this.capacity == "visits") return this.maxVisitsPerFacility;
		return this.maxStaffPerFacility * n_max_s;
	}

	static create(props: {
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
		linearAverageCost: number;
		capacity: "visits" | "staff";
		initialVisits?: number | null;
	}) {
		return new Intervention(
			props.fixedProgram,
			props.fixedFacility,
			props.percFTEAllocated,
			props.costPerStaff,
			props.visitsPerYear,
			props.initialFacilities,
			props.initialStaffPerFacility,
			props.currentVisitsPerFacility,
			props.maxVisitsPerFacility,
			props.maxStaffPerFacility,
			props.targetVisits,
			props.integrated,
			props.linearAverageCost,
			props.capacity,
			props.initialVisits,
		);
	}
}

export interface IService {
	name: string;
	costPerStaff: number;
	minutesPerService: number;
	variableCosts: number;
	percentage: number;
	hasEquipment: boolean;
	maxServicesPerEquipment: number;
	costPerEquipment: number;
	training: number;
	description?: string;
}

export interface IIntervention {
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
	linearAverageCost: number;
	capacity: "visits" | "staff";
	initialVisits?: number | null;
}