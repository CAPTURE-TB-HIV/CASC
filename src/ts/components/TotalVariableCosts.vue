<template>
	<span>Total variable costs<br />
		<span v-if="services.length > 1"> &sum; (V<sub>i</sub> * n<sub>i</sub>)</span>
		<span v-if="services.length == 1"> V * n</span>
	</span>
</template>
<script setup lang="ts">
import { IIntervention, IService } from "../intervention"

defineProps<{ services: IService[], intervention: IIntervention }>();
</script>