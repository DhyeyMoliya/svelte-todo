<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';

	import { login } from '$lib/services/auth';

	import { createForm } from 'svelte-form-validation';
	import * as yup from 'yup';

	const { values, isValid, highlight } = createForm({
		values: {
			email: 'dhyey@cloudedots.com',
			password: 'dhyey123',
		},
		validationSchema: yup.object().shape({
			email: yup.string().email().trim().required(),
			password: yup.string().trim().min(6).required(),
		}),
	});

	const onLogin = async () => {
		const res = await login($values);
		res && invalidate();
	};
</script>

<section class="row justify-content-center">
	<div class="col-6">
		<form class="border shadow-sm shadow-primary rounded p-3 bg-light">
			<h3>Login</h3>
			<div class="mb-3">
				<label for="email" class="form-label">Email</label>
				<input type="text" class="form-control" id="email" name="email" bind:value={$values.email} use:highlight />
			</div>
			<div class="mb-3">
				<label for="password" class="form-label">Password</label>
				<input type="text" class="form-control" id="password" name="password" bind:value={$values.password} use:highlight />
			</div>
			<div class="text-center">
				<button class="btn btn-primary" type="button" on:click={onLogin} disabled={!$isValid}>Login</button>
			</div>
		</form>
	</div>
</section>
