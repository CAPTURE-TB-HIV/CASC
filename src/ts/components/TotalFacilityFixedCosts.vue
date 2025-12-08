<template>
	<span>Total facility fixed costs<br />
		<span v-if="services.length > 1 && !intervention.integrated"> (n<sub>0</sub> / n_max<sub>0</sub>) * FF</span>
		<span v-if="services.length == 1 || intervention.integrated"> (n / n_max) * FF</span>
	</span>
</template>
<script setup lang="ts">
import { IIntervention, IService } from "../intervention"

defineProps<{ services: IService[], intervention: IIntervention }>();
</script>