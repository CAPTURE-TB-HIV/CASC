<template>
	<div class="form-group mb-4">
		<a @click="toggle" href="#" class="text-dark"><h5>{{ title }}<span>{{ state.show ? '&#x25B2;' : '&#x25BC;' }}</span></h5></a>
		<div class="collapse" :class="{ 'show': state.show }">
			<slot></slot>
		</div>
	</div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
const state = reactive({
	show: true
});
function toggle() {
	state.show = !state.show
}

defineProps<{ title: string }>();
</script>