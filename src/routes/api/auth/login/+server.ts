import { base } from '$app/paths';
import { createHash, verifyHash } from '$lib/helpers/hash';
import { handleError, successRes } from '$lib/helpers/response';
import { sessionExpiryDuration } from '$lib/helpers/session';
import { User, type IUser } from '$lib/models/user';
import { UserSession } from '$lib/models/user-session';
import { error, type RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const POST: RequestHandler = async ({ request, setHeaders }) => {
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
