// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		sessionId: string;
		user: {
			name: string;
			email: string;
		};
	}
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
}

declare type DeepPartial<T> = T extends Function ? T : T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
declare var bootstrap: import('bootstrap');
