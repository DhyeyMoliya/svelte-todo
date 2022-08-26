import { createHash, verifyHash } from '$lib/helpers/hash';
import { handleError, successRes } from '$lib/helpers/response';
import { User, type IUser } from '$lib/models/user';
import { error, type RequestHandler } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: { name: string; email: string; password: string } = await request.json();
		if (!body.name.trim() || !body.email.trim() || !body.password.trim()) {
			throw error(400);
		}

		const existingUser = await User.findOne({ email: body.email });
		if (existingUser) {
			throw error(419);
		}

		const newUser = new User({
			name: body.name.trim(),
			email: body.email.trim(),
			hashedPassword: createHash(body.password.trim()),
		});

		await newUser.save();
		const userData: IUser = {
			_id: newUser._id,
			name: newUser.name,
			email: newUser.email,
		};
		return successRes(userData);
	} catch (err) {
		handleError(err);
	}
};
