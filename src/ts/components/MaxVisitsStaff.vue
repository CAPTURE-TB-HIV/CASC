<template>
	<th>Max visits per facility per year <br />(n_max<sub v-if="services.length > 1">0</sub>)</th>
</template>
<script setup lang="ts">
defineProps<{ services: any[] }>();
</script>