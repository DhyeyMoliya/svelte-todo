import dotenv from 'dotenv';
dotenv.config();
import type { Handle } from '@sveltejs/kit';
import { connectMongoDB } from '$lib/server/db';
import { initModels } from '$lib/models';
import * as cookie from 'cookie';
import { UserSession } from '$lib/models/user-session';
import type { IUser } from '$lib/models/user';
import { base } from '$app/paths';
import { validateSession } from '$lib/server/session';

connectMongoDB().then(() => {
	initModels();
});

export const handle: Handle = async ({ event, resolve }) => {
	const cookiesData = cookie.parse(event.request.headers.get('cookie') || '');
	if (cookiesData.session) {
		try {
			const session = await UserSession.findById(cookiesData.session).populate('user', 'name email');
			if (session) {
				const sessionUser = session.user as IUser;
				session.lastAccessedAt = new Date();

				event.locals.sessionId = cookiesData.session;
				event.locals.user = {
					_id: sessionUser._id.toString(),
					name: sessionUser.name,
					email: sessionUser.email,
				};

				await session.save();
			} else {
				event.cookies.delete('session');
			}
		} catch (err) {
			console.error(err);
		}
	}

	if (event.url.pathname.startsWith('/api') && (event.url.pathname.startsWith('/api/auth/logout') || !event.url.pathname.startsWith('/api/auth'))) {
		if (!validateSession(event.locals)) {
			return new Response('Unauthorized', {
				status: 401,
			});
		}
	}

	const response = resolve(event);
	return response;
};
