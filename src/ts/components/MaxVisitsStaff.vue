<template>
	<span>
		<span v-if="!intervention.integrated" v-for="(service, index) in services" :key="index">
			Max visits per FTE per year
			<input-name text="n_max_s" :services="services" :index="index"></input-name>
		</span>
		<span v-if="intervention.integrated">Max visits per FTE per year <br /> (n_max_s)</span>
	</span>
</template>
<script setup lang="ts">
import InputName from "./InputName.vue";
import {Intervention, Service} from "../intervention"

defineProps<{ services: any[], intervention: Intervention }>();
</script>