<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import Button from '$lib/components/ui/button.svelte';
    import loadingSpinner from '$lib/assets/gooey-balls-2.svg';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let user = $derived(data.session?.user ?? null);

    async function handleSignOut() {
        const { error } = await supabase.auth.signOut();
    }
</script>

<div class="flex min-h-screen items-center justify-center p-4">
    {#if !user}
        <div class="flex flex-col items-center gap-4">
             <img src={loadingSpinner} alt="Loading" class="h-12 w-12" />
        </div>
    {:else}
        <div class="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="text-center space-y-2">
                <div class="h-20 w-20 bg-neutral-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <span class="text-2xl font-medium text-neutral-900">
                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </span>
                </div>
                <h1 class="text-2xl font-semibold tracking-tight" style="font-family: 'Reem Kufi', sans-serif; font-weight: 400;">السلام عليكم</h1>
                <p class="text-muted-foreground">{user.user_metadata?.full_name || 'User'}</p>
            </div>

            <div class="space-y-4">
                <div class="p-4 rounded-lg bg-neutral-50 border border-neutral-100 space-y-1">
                    <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
                    <p class="text-sm font-medium">{user.email}</p>
                </div>

                <Button class="w-full h-12" onclick={handleSignOut}>
                    Sign out
                </Button>
            </div>
        </div>
    {/if}
</div>
