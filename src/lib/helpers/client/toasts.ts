import { browser } from '$app/env';
import type { INotyfNotificationOptions } from 'notyf';
import { Notyf, NotyfEvent } from 'notyf';

const textColor = '#fff';
const infoBg = 'teal';
const warnBg = 'orange';

let notyf;

const createNotyFInstance = () => {
	if (!notyf) {
		notyf = new Notyf({
			dismissible: true,
			duration: 3000,
			types: [
				{
					type: 'info',
					background: infoBg,
					icon: {
						className: 'far fa-user fa-lg',
						color: textColor,
					},
				},
				{
					type: 'warning',
					background: warnBg,
					icon: {
						className: 'fas fa-exclamation-triangle fa-lg',
						color: textColor,
					},
				},
			],
		});
	}
};
export class InfoToast {
	public static show(message: any, options?: Partial<INotyfNotificationOptions>) {
		return new Promise((resolve, reject) => {
			if (browser) {
				setTimeout(() => {
					createNotyFInstance();
					notyf
						.open({
							type: 'info',
							message: message,
							...options,
						})
						.on(NotyfEvent.Dismiss, () => {
							resolve(null);
						});
				});
			} else {
				resolve(null);
			}
		});
	}
}

export class ErrorToast {
	public static show(message: any, options?: Partial<INotyfNotificationOptions>) {
		return new Promise((resolve, reject) => {
			if (browser) {
				setTimeout(() => {
					createNotyFInstance();
					notyf
						.open({
							type: 'error',
							message: message,
							...options,
						})
						.on(NotyfEvent.Dismiss, () => {
							resolve(null);
						});
				});
			} else {
				resolve(null);
			}
		});
	}
}

export class SuccessToast {
	public static show(message: any, options?: Partial<INotyfNotificationOptions>) {
		return new Promise((resolve, reject) => {
			if (browser) {
				setTimeout(() => {
					createNotyFInstance();
					notyf
						.open({
							type: 'success',
							message: message,
							...options,
						})
						.on(NotyfEvent.Dismiss, () => {
							resolve(null);
						});
				});
			} else {
				resolve(null);
			}
		});
	}
}

export class WarningToast {
	public static show(message: any, options?: Partial<INotyfNotificationOptions>) {
		return new Promise((resolve, reject) => {
			if (browser) {
				setTimeout(() => {
					createNotyFInstance();
					notyf
						.open({
							type: 'warning',
							message: message,
							...options,
						})
						.on(NotyfEvent.Dismiss, () => {
							resolve(null);
						});
				});
			} else {
				resolve(null);
			}
		});
	}
}

export class DeleteMessage {
	public static show(message: any, options?: Partial<INotyfNotificationOptions>) {
		return new Promise((resolve, reject) => {
			if (browser) {
				setTimeout(() => {
					createNotyFInstance();
					notyf
						.open({
							type: 'success',
							message: message,
							...options,
						})
						.on(NotyfEvent.Dismiss, () => {
							resolve(null);
						});
				});
			} else {
				resolve(null);
			}
		});
	}
}
