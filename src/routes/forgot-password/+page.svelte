<script lang="ts">
	import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';
	import Button from '$lib/components/ui/button.svelte';
    import Input from '$lib/components/ui/input.svelte';
    import Label from '$lib/components/ui/label.svelte';

	let email = $state('');
    let isLoading = $state(false);
    let errorMessage = $state('');
    let success = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
        isLoading = true;
        errorMessage = '';

        try {
            const redirectUrl = window.location.origin + '/auth/update-password';
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            });
            if (error) throw error;
            success = true;
        } catch (error: any) {
            console.error('Reset password error:', error);
            errorMessage = error.message || 'An unexpected error occurred.';
        } finally {
            isLoading = false;
        }
	}
</script>

<svelte:head>
	<title>Forgot Password - Avagenc</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4 py-12">
	<div class="w-full max-w-sm">
		<!-- Logo -->
		<div class="mb-12 text-center">
			<img src="/favicon.svg" alt="Avagenc" class="h-10 mx-auto brightness-0" />
		</div>

        {#if success}
             <!-- Check Inbox State -->
             <div class="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="flex justify-center mb-6">
                    <div class="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center">
                        <svg class="h-8 w-8 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                    </div>
                </div>

                <div class="space-y-2">
                    <h2 class="text-2xl font-semibold tracking-tight text-foreground">Check your inbox</h2>
                    <p class="text-muted-foreground">
                        We sent a password reset link to <span class="font-medium text-foreground">{email}</span>
                    </p>
                </div>

                <div class="pt-4">
                    <a
                        href="/signin"
                        class="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                    >
                        Back to sign in
                    </a>
                </div>
            </div>
        {:else}
            <!-- Heading -->
            <div class="mb-8">
                <h2 class="text-3xl font-semibold tracking-tight text-foreground">
                    Reset your password
                </h2>
                <p class="mt-2 text-sm text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <!-- Form -->
            <form onsubmit={handleSubmit} class="space-y-6">
                {#if errorMessage}
                    <div class="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md">
                        {errorMessage}
                    </div>
                {/if}

                <div class="space-y-2">
                    <Label for="email" class="sr-only">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        placeholder="Email"
                        bind:value={email}
                        class="transition-colors"
                        variant="underlined"
                        disabled={isLoading}
                    />
                </div>

                <Button type="submit" class="w-full h-12 text-base font-medium rounded-lg" loading={isLoading}>
                    Send reset link
                </Button>

                <div class="text-center">
                     <a
                        href="/signin"
                        class="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                    >
                        Back to sign in
                    </a>
                </div>
            </form>
        {/if}
    </div>
</div>
