import { nSemiFixed, visitsPerStaff, weightedAverage } from "../src/ts/logic";

describe("logic", () => {
	describe("visitsPerStaff", () => {
		it("should calculate visits from minutes per service and available minutes", () => {
			const result = visitsPerStaff(10, 50);
			expect(result).toBe((60 * 8 * 219 * 0.5) / 10);
		})
	});

	describe("weightedAverage", () => {
		it("should calculate weighted average", () => {
			const result = weightedAverage([{ value: 10, weight: 0.1 }, { value: 15, weight: 0.3 }, { value: 5, weight: 0.5 }]);
			expect(result).toBe(10 * 0.1 + 15 * 0.3 + 5 * 0.5)
		})
	});

	describe("nSemiFixed", () => {
		it("should calculate quantities based on n/n_max where an extra unit is needed", () => {
			const result = nSemiFixed(10, 4);
			expect(result).toBe(3);
		});

		it("should calculate quantities based on n/n_max where units are exact", () => {
			const result = nSemiFixed(10, 5);
			expect(result).toBe(2);
		})
	});

	describe("costFunctionInputs", () => {
		it("should calculate inputs", {

		})
	})
});
