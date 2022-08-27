import type { Handle } from '@sveltejs/kit';
import { connectMongoDB } from '$lib/helpers/db';
import { initModels } from '$lib/models';
import * as cookie from 'cookie';
import { UserSession } from '$lib/models/user-session';
import type { IUser } from '$lib/models/user';
import { base } from '$app/paths';

connectMongoDB().then(() => {
	initModels();
});

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	if (cookies.session) {
		try {
			const session = await UserSession.findById(cookies.session).populate('user', 'name email');
			if (session) {
				const sessionUser = session.user as IUser;
				session.lastAccessedAt = new Date();

				event.locals.sessionId = cookies.session;
				event.locals.user = {
					name: sessionUser.name,
					email: sessionUser.email,
				};

				await session.save();
			} else {
				event.setHeaders({
					'set-cookie': cookie.serialize('session', '', {
						path: `${base}/`,
						expires: new Date(0),
					}),
				});
			}
		} catch (err) {
			console.log(err);
		}
	}

	const response = resolve(event);
	return response;
};
