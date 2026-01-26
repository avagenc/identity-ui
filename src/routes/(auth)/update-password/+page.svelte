<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';
	import Button from '$lib/components/ui/button.svelte';
    import Input from '$lib/components/ui/input.svelte';
    import Label from '$lib/components/ui/label.svelte';

	let password = $state('');
    let confirmPassword = $state('');
    let honeypot = $state('');
    let isLoading = $state(false);
    let errorMessage = $state('');
    let success = $state(false);
    let verifyingSession = $state(true);
    let sessionValid = $state(false);
    let authListener: any = null;

    const hasMinLength = $derived(password.length >= 8);
    const hasUppercase = $derived(/[A-Z]/.test(password));
    const hasNumber = $derived(/[0-9]/.test(password));
    const isPasswordValid = $derived(hasMinLength && hasUppercase && hasNumber);
    const passwordsMatch = $derived(password === confirmPassword && confirmPassword.length > 0);
    const isFormValid = $derived(isPasswordValid && passwordsMatch);

    onMount(async () => {
        // Initial check: if we already have a session (e.g. from previous nav or fast load)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            sessionValid = true;
            verifyingSession = false;
            return;
        }

        // Listen for the event that happens when the recovery link is clicked
        // Note: Sometimes it fires SIGNED_IN after processing the hash
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")) {
                 verifyingSession = false;
                 sessionValid = true;
            }
        });
        authListener = subscription;

        // Fallback safety timeout
        // If Supabase interactions hang or hash is invalid
        setTimeout(async () => {
            if (verifyingSession) {
                // One last check
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    sessionValid = true;
                } else {
                    sessionValid = false;
                }
                verifyingSession = false;
            }
        }, 3000); // 3s timeout
    });

    onDestroy(() => {
        if (authListener) authListener.unsubscribe();
    });

	async function handleSubmit(e: Event) {
		e.preventDefault();
        if (honeypot) return;

        isLoading = true;
        errorMessage = '';

        if (password !== confirmPassword) {
            errorMessage = "Passwords do not match";
            isLoading = false;
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });
            if (error) throw error;
            success = true;
            // Clean up hash from URL
            window.history.replaceState(null, '', window.location.pathname);
        } catch (error: any) {
            console.error('Update password error:', error);
            if (error.status === 429 || error.message?.includes('rate limit')) {
                errorMessage = 'Too many attempts. Please wait a moment and try again.';
            } else {
                errorMessage = error.message || 'An unexpected error occurred.';
            }
        } finally {
            isLoading = false;
        }
	}
</script>

<svelte:head>
	<title>Update Password - Avagenc</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4 py-12">
	<div class="w-full max-w-sm">
		<!-- Logo -->
		<div class="mb-12 text-center">
			<img src="/favicon.svg" alt="Avagenc" class="h-10 mx-auto brightness-0" />
		</div>

        {#if verifyingSession}
              <div class="text-center py-12 animate-in fade-in duration-500">
                   <div class="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 mx-auto"></div>
                   <p class="mt-4 text-sm text-muted-foreground">Verifying secure link...</p>
              </div>
        {:else if !sessionValid}
             <!-- Invalid/Expired Link State -->
             <div class="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="flex justify-center mb-6">
                    <div class="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                           <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                </div>

                <div class="space-y-2">
                    <h2 class="text-2xl font-semibold tracking-tight text-foreground">Invalid Link</h2>
                    <p class="text-muted-foreground">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                </div>

                <div class="pt-4">
                     <Button class="w-full h-12" onclick={() => goto('/forgot-password')}>
                        Request new link
                    </Button>
                     <div class="mt-4">
                        <a href="/signin" class="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
                            Back to sign in
                        </a>
                     </div>
                </div>
            </div>
        {:else if success}
             <!-- Success State -->
             <div class="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="flex justify-center mb-6">
                    <div class="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center">
                        <svg class="h-8 w-8 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                           <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                <div class="space-y-2">
                    <h2 class="text-2xl font-semibold tracking-tight text-foreground">Password updated</h2>
                    <p class="text-muted-foreground">
                        Your password has been successfully reset.
                    </p>
                </div>

                <div class="pt-4">
                     <Button class="w-full h-12" onclick={() => goto('/')}>
                        Continue to Profile
                    </Button>
                </div>
            </div>
        {:else}
            <!-- Heading -->
            <div class="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 class="text-3xl font-semibold tracking-tight text-foreground">
                    Set new password
                </h2>
                <p class="mt-2 text-sm text-muted-foreground">
                    Please enter your new password below.
                </p>
            </div>

            <!-- Form -->
            <form onsubmit={handleSubmit} class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                {#if errorMessage}
                    <div class="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md">
                        {errorMessage}
                    </div>
                {/if}

                <div class="space-y-2">
                    <Label for="password" class="sr-only">New Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autocomplete="new-password"
                        placeholder="New Password"
                        bind:value={password}
                        class="transition-colors"
                        variant="underlined"
                        disabled={isLoading}
                    />
                    {#if password.length > 0}
                        <div class="flex gap-3 text-xs pt-1">
                            <span class={hasMinLength ? 'text-green-600' : 'text-muted-foreground'}>8+ chars</span>
                            <span class={hasUppercase ? 'text-green-600' : 'text-muted-foreground'}>1 uppercase</span>
                            <span class={hasNumber ? 'text-green-600' : 'text-muted-foreground'}>1 number</span>
                        </div>
                    {/if}
                </div>

                <!-- Honeypot field -->
                <input
                    type="text"
                    name="website"
                    bind:value={honeypot}
                    autocomplete="off"
                    tabindex="-1"
                    aria-hidden="true"
                    style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;"
                />

                <div class="space-y-2">
                    <Label for="confirmPassword" class="sr-only">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autocomplete="new-password"
                        placeholder="Confirm Password"
                        bind:value={confirmPassword}
                        class="transition-colors"
                        variant="underlined"
                        disabled={isLoading}
                    />
                </div>

                <Button type="submit" class="w-full h-12 text-base font-medium rounded-lg" loading={isLoading} disabled={isLoading || !isFormValid}>
                    Update password
                </Button>
            </form>
        {/if}
    </div>
</div>
