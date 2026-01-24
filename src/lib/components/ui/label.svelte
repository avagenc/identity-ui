<script lang="ts">
    import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = HTMLLabelAttributes & {
        children: Snippet;
    };

	let { class: className, children, ...rest }: Props = $props();

    function cn(...inputs: (string | undefined | null | false)[]) {
        return inputs.filter(Boolean).join(' ');
    }
</script>

<label
	class={cn(
		"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
		className
	)}
	{...rest}
>
    {@render children()}
</label>
