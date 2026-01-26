<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button.svelte';

	const status = $derived($page.status);
	const error = $derived($page.error);

	const isNotFoundError = $derived(status === 404);
	const title = $derived(isNotFoundError ? 'Page not found' : 'Something went wrong');
	const description = $derived(
		isNotFoundError
			? "The page you're looking for doesn't exist or has been moved."
			: "An unexpected error occurred. We're working to fix it."
	);
</script>

<svelte:head>
	<title>{title} - Avagenc</title>
</svelte:head>

<div class="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
	<div class="animate-in fade-in slide-in-from-bottom-4 duration-1000">
		<!-- Error Icon/Graphic -->
		<div class="mb-8 flex justify-center">
			<div class="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-50">
				{#if isNotFoundError}
					<svg
						class="h-10 w-10 text-neutral-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="1.5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
						/>
					</svg>
				{:else}
					<svg
						class="h-10 w-10 text-neutral-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="1.5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
						/>
					</svg>
				{/if}
			</div>
		</div>

		<h1 class="mb-3 text-4xl font-semibold tracking-tight text-foreground">
			{status}
		</h1>
		<h2 class="mb-4 text-xl font-medium text-foreground">
			{title}
		</h2>
		<p class="mx-auto mb-10 max-w-xs text-muted-foreground">
			{description}
		</p>

		<div class="flex justify-center">
			<Button onclick={() => window.location.href = "/"} variant="default" class="h-11 px-8">Back to home</Button>
		</div>
	</div>
</div>
