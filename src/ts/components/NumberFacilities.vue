<template>
	<span>Number of facilities<br />
		<span v-if="services.length > 1 && !intervention.integrated"> (n<sub>0</sub> / n_max<sub>0</sub>)</span>
		<span v-if="services.length == 1 || intervention.integrated">  (n / n_max)</span>
	</span>
</template>
<script setup lang="ts">
defineProps<{ services: any[], intervention: Intervention }>();
</script>