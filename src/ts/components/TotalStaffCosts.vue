<template>
	<span>Total staff costs<br />
		<span v-if="services.length > 1 && !intervention.integrated"> &sum; [(n<sub>i</sub> / n_max_s<sub>i</sub>) * ST<sub>i</sub>]</span>
		<span v-if="services.length == 1 || intervention.integrated"> (n / n_max_s) * ST</span>
	</span>
</template>
<script setup lang="ts">
defineProps<{ services: any[], intervention: Intervention }>();
</script>