<script lang="ts">
	import './layout.css';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="bg-background min-h-screen font-sans antialiased"
	style="font-family: 'Inter', sans-serif;"
>
	{@render children()}
</div>
