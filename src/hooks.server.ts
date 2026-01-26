import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Create Supabase Server Client
	event.locals.supabase = createServerClient(env.PUBLIC_SUPABASE_URL!, env.PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	// 2. Helper to get session securely
	event.locals.getSession = async () => {
		const { data: { session } } = await event.locals.supabase.auth.getSession();
		return session;
	};

	const session = await event.locals.getSession();
	event.locals.session = session;
	event.locals.user = session?.user ?? null;

	const path = event.url.pathname;
	const isAuthRoute = ['/signin', '/signup', '/forgot-password', '/update-password'].some(p => path === p || path.startsWith(p + '/'));
	const isProtectedRoute = path === '/';

	// Scenario B (The Member): Already authenticated users shouldn't see auth forms
	if (session && isAuthRoute) {
		throw redirect(303, '/');
	}

	// Scenario A (The Guest): Unauthenticated users shouldn't access protected content
	if (!session && isProtectedRoute) {
		throw redirect(303, '/signin');
	}

	return await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
