<template>
	<span>Average cost<br />
		<span v-if="services.length > 1 && !intervention.integrated">  &sum; (...) / n<sub>0</sub></span>
		<span v-if="services.length == 1 || intervention.integrated">   &sum; (...) / n</span>
	</span>
</template>
<script setup lang="ts">
defineProps<{ services: any[], intervention: Intervention }>();
</script>