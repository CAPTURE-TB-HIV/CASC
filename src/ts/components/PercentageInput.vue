<template>
	<div class="form-group mb-2">
		<label class="d-block">{{ label }}</label>
		<input type="range" class="form-range" v-model.number="localModel" step="0.01" min="0.001" max="100">
		<div class="input-group">
			<input v-model.number="localModel" type="number" placeholder="Enter number" class="form-control"
				:step="integer ? '1' : 0.01" min="0" max="100" @input="onInput" />
			<div class="input-group-append">
				<span class="input-group-text" style="border-top-left-radius: 0;
    border-bottom-left-radius: 0;">%</span>
			</div>
		</div>
		<small class="form-text text-muted">{{ help }}</small>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
	integer?: boolean;
	label: string;
	help?: string;
	modelValue: number;
}>()


const emit = defineEmits<{
	(e: "update:modelValue", value: number): void;
}>();

const localModel = computed({
	get: () => props.modelValue,
	set: (val: number) => emit("update:modelValue", val || 0),
});

function onInput(event: Event) {
	const target = event.target as HTMLInputElement
	let value = target.value === '' ? NaN : Number(target.value)

	// allow empty for now if you want:
	if (Number.isNaN(value)) {
		emit('update:modelValue', value as any)
		return
	}

	emit('update:modelValue', value)
}
</script>
