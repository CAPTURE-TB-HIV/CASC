<template>
	<span>Max visits per facility per year <br />
		<span v-if="services.length > 1 && !intervention.integrated"> (n_max<sub>0</sub>)</span>
		<span v-if="services.length == 1 || intervention.integrated">  (n_max)</span>
	</span>
</template>
<script setup lang="ts">
import {Intervention} from "../intervention"
defineProps<{ services: any[], intervention: Intervention }>();
</script>