<template>
	<th v-if="!intervention.integrated" v-for="(service, index) in services" :key="index">Max
		visits per
		FTE per year<span v-text="services.length > 1 ? ' - ' + service.name : ''"></span>
		<br />(n_max_s<sub v-if="services.length > 1">{{ index }}</sub>)
	</th>
	<th v-if="intervention.integrated">Max visits per FTE per year <br /> (n_max_s)</th>
</template>
<script setup lang="ts">
defineProps<{ services: any[], intervention: Intervention }>();
</script>