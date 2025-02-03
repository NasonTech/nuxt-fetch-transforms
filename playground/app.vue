<script setup>
const { data: user, refresh } = await useFetch('/api/user', { transform: useFetchTransform('/api/user', 'get') })
</script>

<template>
	<div>
		<pre>{{ user }}</pre>
		<div>Typeof user.createdAt: {{ typeof user.createdAt }} {{ user.createdAt.constructor.name }}</div>
		<div>Typeof user.updatedAt: {{ typeof user.updatedAt }} {{ user.updatedAt.constructor.name }}</div>
		<div>
			<button @click="refresh">Refresh</button>
		</div>
	</div>
</template>
