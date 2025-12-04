<template>
	<span>Total variable costs<br />
		<span v-if="services.length > 1 && !intervention.integrated"> &sum; (V<sub>i</sub> * n<sub>i</sub>)</span>
		<span v-if="services.length == 1 || intervention.integrated">  V * n</span>
	</span>
</template>
<script setup lang="ts">
defineProps<{ services: any[], intervention: Intervention }>();
</script>