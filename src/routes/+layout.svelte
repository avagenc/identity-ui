<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import './layout.css';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			// Trigger server-side guard on auth changes
			invalidateAll();
		});

		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Reem+Kufi:wght@400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="bg-background min-h-screen font-sans antialiased"
	style="font-family: 'Inter', sans-serif;"
>
	{@render children()}
</div>
