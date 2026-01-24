<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
        variant?: 'default' | 'underlined';
    };

	let { class: className, variant = 'default', ...rest }: Props = $props();

    function cn(...inputs: any[]) {
        return inputs.filter(Boolean).join(' ');
    }

    const variants = {
        default: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        underlined: "w-full border-0 border-b border-border bg-transparent focus:bg-neutral-50/50 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-neutral-500 focus:outline-none focus-visible:ring-0 focus:ring-0 transition-all duration-300 ease-out shadow-none rounded-none px-2"
    };
</script>

<input
	class={cn(
        "file:border-0 file:bg-transparent file:text-sm file:font-medium", // Common file input styles
        variants[variant],
		className
	)}
	{...rest}
/>
