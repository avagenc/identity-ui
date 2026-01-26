<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';
    import Button from '$lib/components/ui/button.svelte';

    let session = $state<any>(null);
    let loading = $state(true);
    let user = $state<any>(null);

    onMount(async () => {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;

            if (!data.session) {
                goto('/signin');
                return;
            }

            session = data.session;
            user = data.session.user;
        } catch (e) {
            console.error('Error fetching session:', e);
            goto('/signin');
        } finally {
            loading = false;
        }
    });

    async function handleSignOut() {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            goto('/signin');
        }
    }
</script>

<svelte:head>
    <title>My Account - Avagenc</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center p-4">
    {#if loading}
        <div class="flex flex-col items-center gap-4">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900"></div>
        </div>
    {:else if user}
        <div class="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="text-center space-y-2">
                <div class="h-20 w-20 bg-neutral-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <span class="text-2xl font-medium text-neutral-900">
                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </span>
                </div>
                <h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
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
