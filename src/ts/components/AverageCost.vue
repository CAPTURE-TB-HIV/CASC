<template>
	<span>Average cost<br />
		<span v-if="services.length > 1 && !intervention.integrated">  &sum; (...) / n<sub>0</sub></span>
		<span v-if="services.length == 1 || intervention.integrated">   &sum; (...) / n</span>
	</span>
</template>
<script setup lang="ts">
import {IIntervention, IService} from "../intervention"

defineProps<{ services: IService[], intervention: IIntervention }>();
</script>