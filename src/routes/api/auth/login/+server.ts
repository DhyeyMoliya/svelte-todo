import { base } from '$app/paths';
import { createHash, verifyHash } from '$lib/helpers/server/hash';
import { handleError, successRes } from '$lib/helpers/server/response';
import { sessionExpiryDuration } from '$lib/helpers/server/session';
import { User, type IUser } from '$lib/models/user';
import { UserSession } from '$lib/models/user-session';
import { error, type RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const POST: RequestHandler = async ({ request, setHeaders, locals }) => {
	try {
		const body: { email: string; password: string } = await request.json();
		if (!body.email || !body.password) {
			throw error(400);
		}

		const user = await User.findOne({ email: body.email });
		if (!user) {
			throw error(404);
		}

		if (!verifyHash(body.password, user.hashedPassword)) {
			throw error(401);
		}

		if (locals.sessionId) {
			await UserSession.remove({ _id: locals.sessionId });
		}

		const newSession = new UserSession({
			user: user._id,
			lastAccessedAt: new Date(),
		});
		await newSession.save();

		const userData: IUser & { sessionId: string } = {
			_id: user._id,
			sessionId: newSession._id,
			name: user.name,
			email: user.email,
		};
		return successRes(userData, 200, {
			'set-cookie': cookie.serialize('session', newSession._id, {
				path: `${base}/`,
				httpOnly: true,
				maxAge: sessionExpiryDuration / 1000,
			}),
		});
	} catch (err) {
		handleError(err);
	}
};
