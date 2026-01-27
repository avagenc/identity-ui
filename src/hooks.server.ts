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
	const isGuestRoute = ['/signin', '/signup'].some(p => path === p || path.startsWith(p + '/'));
	const isProtectedRoute = path === '/';

	// Authenticated users shouldn't see guest pages (signin/signup)
	if (session && isGuestRoute) {
		throw redirect(303, '/');
	}

	// Guests shouldn't access protected content
	if (!session && isProtectedRoute) {
		throw redirect(303, '/signin');
	}

	return await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
