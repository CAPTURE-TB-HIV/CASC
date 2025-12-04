<template>
	<span>
		<span v-text="services.length > 1 ? ' - ' + services[index].name : ''"></span>
		<br />({{ text }}<sub v-if="services.length > 1">{{ index }}</sub>)
	</span>
</template>
<script setup lang="ts">
import {Intervention, Service} from "../intervention"

defineProps<{ text: string, services: Service[], index: number }>()
</script>