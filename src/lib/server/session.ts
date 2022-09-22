export const getSessionExpiryDuration = () => {
	const { APP_SESSION_DURATION_DAYS } = process.env;
	return parseInt(APP_SESSION_DURATION_DAYS || '1') * 60 * 60 * 24 * 1000;
};

export const validateSession = (locals: App.Locals) => {
	if (locals.sessionId && locals.user) {
		return true;
	} else {
		return false;
	}
};
