<template>
	<div class="form-group mb-2">
		<label class="d-block" :for="name">{{ label }}</label>
		<input v-model.number="localModel" :name="name" type="number" placeholder="Enter number" class="form-control"
			:step="integer ? '1' : 0.001" :min="0" :max="max" />
		<small class="form-text text-muted">{{ help }}</small>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const name = Math.round(Math.random() * 1000000000).toString();

const props = withDefaults(
	defineProps<{
		integer?: boolean;
		label: string;
		help?: string;
		modelValue: number;
		min?: number;
		max?: number
	}>(),
	{ integer: true, min: 0, max: 1000000000 }
);

const emit = defineEmits<{
	(e: "update:modelValue", value: number): void;
}>();

const localModel = computed({
	get: () => props.modelValue,
	set: (val: any) => {
		let value = !val ? 0 : Number(val);
		if (props.min !== undefined && value < props.min) value = props.min
    if (props.max !== undefined && value > props.max) value = props.max
		emit("update:modelValue", value)
	},
});
</script>
