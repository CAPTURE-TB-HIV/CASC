
const useCaseOne: UseCase = {
	intervention: {
		fixedProgram: 28080,
		fixedFacility: 537.56,
		percFTEAllocated: 12.7,
		costPerStaff: 0,
		visitsPerYear: 2649,
		initialFacilities: 1000,
		initialStaffPerFacility: 2,
		currentVisitsPerFacility: 889,
		maxVisitsPerFacility: 8010,
		maxStaffPerFacility: 10,
		targetVisits: 19202400,
		integrated: false,
		initialVisits: null,
		linearAverageCost: 2.88,
		capacity: "staff"
	},
	services: [{
		name: "Family Planning",
		description: "The family planning intervention includes counselling and provision FP of methods (oral contraceptives, injectables, intra uterine devices, implants and condoms). FP methods are provided for one month (progestin only pills), three months (COC's and injectables), and 3- 5 years (IUDs and implants).",
		costPerStaff: 723.08,
		minutesPerService: 15,
		variableCosts: 1.45,
		percentage: 100,
		hasEquipment: false,
		costPerEquipment: 0,
		training: 0,
		maxServicesPerEquipment: 0
	}]
}

const useCaseTwo: UseCase = {
	intervention: {
		fixedProgram: 46800,
		fixedFacility: 2005.07,
		percFTEAllocated: 100,
		costPerStaff: 0,
		visitsPerYear: 2200,
		initialFacilities: 10,
		initialStaffPerFacility: 1,
		currentVisitsPerFacility: 2200,
		initialVisits: null,
		maxVisitsPerFacility: 28226,
		maxStaffPerFacility: 0,
		targetVisits: 37497600,
		integrated: false,
		linearAverageCost: 2.88,
		capacity: "visits"
	},
	services: [{
		name: "WHO screening tool and sputum collection",
		description: "",
		costPerStaff: 5693.52,
		minutesPerService: 6,
		variableCosts: 0.17,
		percentage: 100,
		hasEquipment: false,
		costPerEquipment: 0,
		training: 0,
		maxServicesPerEquipment: 0
	},
	{
		name: "Xpert test",
		percentage: 21,
		description: "",
		costPerStaff: 5460,
		minutesPerService: 5,
		variableCosts: 9.98,
		hasEquipment: true,
		maxServicesPerEquipment: 20,
		costPerEquipment: 2916.67,
		training: 0
	}]
}

const useCaseThree: UseCase = {
	intervention: {
		fixedProgram: 28080,
		fixedFacility: 537.56,
		percFTEAllocated: 12.7,
		costPerStaff: 723.08,
		visitsPerYear: 2649,
		initialFacilities: 1500,
		initialStaffPerFacility: 2,
		currentVisitsPerFacility: 889,
		initialVisits: 2059751,
		maxVisitsPerFacility: 6866,
		maxStaffPerFacility: 10,
		targetVisits: 20482560,
		integrated: true,
		linearAverageCost: 2.88,
		capacity: "staff"
	},
	services: [{
		name: "Family Planning Visit",
		description: "The family planning intervention includes counselling and provision FP of methods (oral contraceptives, injectables, intra uterine devices, implants and condoms). FP methods are provided for one month (progestin only pills), three months (COC's and injectables), and 3- 5 years (IUDs and implants).",
		costPerStaff: 723.08,
		minutesPerService: 15,
		percentage: 100,
		variableCosts: 1.45,
		hasEquipment: false,
		costPerEquipment: 0,
		training: 0,
		maxServicesPerEquipment: 0
	},
	{
		name: "Screening Visit",
		description: "The family planning intervention includes counselling and provision FP of methods (oral contraceptives, injectables, intra uterine devices, implants and condoms). FP methods are provided for one month (progestin only pills), three months (COC's and injectables), and 3- 5 years (IUDs and implants).",
		costPerStaff: 723.08,
		minutesPerService: 10,
		percentage: 25,
		variableCosts: 0.14,
		hasEquipment: false,
		costPerEquipment: 0,
		training: 0,
		maxServicesPerEquipment: 0
	}]
}

const useCases: UseCase[] = [useCaseOne, useCaseTwo, useCaseThree];
export default useCases;