import { env } from '$env/dynamic/private';

const { APP_SESSION_DURATION_DAYS } = env;

export const sessionExpiryDuration = parseInt(APP_SESSION_DURATION_DAYS || '1') * 60 * 60 * 24 * 1000;

export const validateSession = (locals: App.Locals) => {
	if (locals.sessionId && locals.user) {
		return true;
	} else {
		return false;
	}
};
