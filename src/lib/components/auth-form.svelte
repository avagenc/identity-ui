<script lang="ts">
	import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';
	import Button from '$lib/components/ui/button.svelte';
    import Input from '$lib/components/ui/input.svelte';
    import Label from '$lib/components/ui/label.svelte';

	type Props = {
		mode: 'signin' | 'signup';
	};

	let { mode }: Props = $props();

	let email = $state('');
	let password = $state('');
	let fullName = $state('');
    let isLoading = $state(false);
    let errorMessage = $state('');
    let verificationNeeded = $state(false);
    let resendLoading = $state(false);
    let resendMessage = $state('');

    const DASHBOARD_URL = 'https://avagenc.com/dashboard';

	async function handleSubmit(e: Event) {
		e.preventDefault();
        isLoading = true;
        errorMessage = '';

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                // Sign Up successful, show check inbox state
                verificationNeeded = true;
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) {
                    if (error.message.includes('Email not confirmed')) {
                        verificationNeeded = true;
                        return;
                    }
                    throw error;
                }
                // Redirect externally
                window.location.href = DASHBOARD_URL;
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            errorMessage = error.message || 'An unexpected error occurred.';
        } finally {
            isLoading = false;
        }
	}

    async function handleResendVerification() {
        if (!email) return;
        resendLoading = true;
        resendMessage = '';
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email
            });
            if (error) throw error;
            resendMessage = 'Verification email sent!';
        } catch (error: any) {
            errorMessage = error.message || 'Failed to resend verification email.';
        } finally {
            resendLoading = false;
        }
    }
</script>

<div class="flex min-h-screen items-center justify-center px-4 py-12">
	<div class="w-full max-w-sm">
		<!-- Logo -->
		<div class="mb-12 text-center">
			<img src="/favicon.svg" alt="Avagenc" class="h-10 mx-auto brightness-0" />
		</div>

        {#if verificationNeeded}
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
                        We sent a verification link to <span class="font-medium text-foreground">{email}</span>
                    </p>
                </div>

                <div class="pt-4 space-y-4">
                    <Button
                        variant="outline"
                        type="button"
                        class="w-full h-12"
                        onclick={handleResendVerification}
                        disabled={resendLoading}
                        loading={resendLoading}
                    >
                        {resendMessage || 'Resend verification email'}
                    </Button>

                    <button
                        type="button"
                        class="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                        onclick={() => {
                            verificationNeeded = false;
                            errorMessage = '';
                            resendMessage = '';
                        }}
                    >
                        Back to sign in
                    </button>
                </div>
            </div>
        {:else}
            <!-- Heading -->
            <div class="mb-8">
                <h2 class="text-3xl font-semibold tracking-tight text-foreground">
                    {mode === 'signin' ? 'Sign in to Avagenc' : 'Create an Avagenc account'}
                </h2>
            </div>

            <!-- Form -->
            <form onsubmit={handleSubmit} class="space-y-6">
                {#if errorMessage}
                    <div class="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md">
                        {errorMessage}
                    </div>
                {/if}
                {#if mode === 'signup'}
                    <div class="space-y-2">
                        <Label for="fullName" class="sr-only">Full name</Label>
                        <Input
                            id="fullName"
                            name="name"
                            type="text"
                            autocomplete="name"
                            placeholder="Full name"
                            bind:value={fullName}
                            class="transition-colors"
                            variant="underlined"
                            disabled={isLoading}
                        />
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

                <div class="space-y-2">
                    <Label for="password" class="sr-only">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autocomplete={mode === 'signin' ? "current-password" : "new-password"}
                        placeholder="Password"
                        bind:value={password}
                        class="transition-colors"
                        variant="underlined"
                        disabled={isLoading}
                    />
                </div>

                {#if mode === 'signin'}
                    <div class="text-right">
                        <a href="#" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Forgot password?
                        </a>
                    </div>
                {/if}

                <Button type="submit" class="w-full h-12 text-base font-medium rounded-lg" loading={isLoading}>
                    {mode === 'signin' ? 'Sign in' : 'Create account'}
                </Button>
            </form>

            <!-- Divider -->
            <div class="my-8 flex items-center gap-4">
                <div class="h-px flex-1 bg-border"></div>
                <span class="text-sm text-muted-foreground">or</span>
                <div class="h-px flex-1 bg-border"></div>
            </div>

            <!-- Google Sign In -->
            <Button variant="outline" type="button" class="w-full h-12 text-base font-medium rounded-lg gap-3" onclick={() => console.log('Google Sign In - Coming Soon')}>
                <svg class="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
            </Button>

            <!-- Footer Link -->
            <div class="mt-12 text-center">
                {#if mode === 'signin'}
                    <p class="text-sm text-muted-foreground">
                        Don't have an account?
                        <a href="/signup" class="text-foreground hover:underline">Create one</a>
                    </p>
                {:else}
                    <p class="text-sm text-muted-foreground">
                        Already have an account?
                        <a href="/" class="text-foreground hover:underline">Sign in</a>
                    </p>
                {/if}
            </div>
        {/if}
	</div>
</div>
