<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { DateTime } from 'luxon';
	import type { PageData } from './$types';
	import { createForm } from 'svelte-form-validation';
	import * as yup from 'yup';
	import { createTodo, updateTodoStatus } from '$lib/services/todos';

	export let data: PageData;
	$: ({ todos = [] } = data);

	let adding = false;
	let showAll = $page.url.searchParams.get('filter') === 'all';

	let { values, highlight, isValid, resetForm } = createForm({
		values: {
			title: '',
			description: '',
		},
		validationSchema: yup.object().shape({
			title: yup.string().trim().required(),
			description: yup.string(),
		}),
	});

	const onRefreshTodos = () => {
		invalidate();
	};

	const onFilterTodos = async (event: Event) => {
		showAll = (event.target as HTMLInputElement).checked;
		const url = new URL($page.url);
		if (showAll) {
			url.searchParams.set('filter', 'all');
		} else {
			url.searchParams.delete('filter');
		}
		await goto(url);
	};

	const onCreateTodo = async () => {
		await createTodo($values);
		adding = false;
		resetForm({
			title: '',
			description: '',
		});
		onRefreshTodos();
	};

	const onAdd = () => {
		adding = true;
	};

	const onCancelAdding = () => {
		adding = false;
		resetForm({
			title: '',
			description: '',
		});
	};

	const onUpdateTodoStatus = async (todoId: string, completed: boolean) => {
		await updateTodoStatus(todoId, completed);
		onRefreshTodos();
	};
</script>

<section class="row gx-3 justify-content-center mb-3">
	<div class="col-8">
		<div class="row align-items-center justify-content-end">
			<div class="col-auto">
				<div class="form-check form-switch">
					<input class="form-check-input" type="checkbox" role="switch" id="filterMode" bind:checked={showAll} on:change={onFilterTodos} />
					<label class="form-check-label" for="filterMode">Show Completed</label>
				</div>
			</div>
			{#if !adding}
				<div class="col-auto">
					<button class="btn btn-outline-primary" type="button" on:click={onAdd}>New To Do</button>
				</div>
			{/if}
		</div>
	</div>
</section>
{#if adding}
	<section class="row justify-content-center mb-3">
		<div class="col-8">
			<form class="border shadow-sm shadow-primary rounded p-3 bg-light">
				<h3>Create New To Do</h3>
				<div class="mb-3">
					<label for="new-todo-title" class="form-label">To Do*</label>
					<input type="text" class="form-control" id="new-todo-title" name="title" bind:value={$values.title} use:highlight />
				</div>
				<div class="mb-3">
					<label for="new-todo-description" class="form-label">Description</label>
					<textarea rows="4" class="form-control" id="new-todo-description" name="description" bind:value={$values.description} use:highlight />
				</div>
				<div class="text-center">
					<button class="btn btn-primary" type="button" on:click={onCreateTodo} disabled={!$isValid}>Create To Do</button>
					<button class="btn btn-outline-secondary" type="button" on:click={onCancelAdding}>Cancel</button>
				</div>
			</form>
		</div>
	</section>
{/if}
<section class="row justify-content-center mb-3">
	<div class="col-8">
		{#if todos?.length}
			{#each todos as todo (todo._id)}
				<div class="card shadow shadow-sm mb-3 {todo.completed ? 'mb-3 bg-light border-0 shadow-none' : ''}">
					<div class="card-body">
						<div class="row">
							<div class="col">
								<h4 class="card-title" class:text-decoration-line-through={todo.completed}>{todo.title}</h4>
								<div class="card-text text-muted mb-2" class:text-decoration-line-through={todo.completed}>
									<div>
										{@html todo.description.replace(/\n/g, '</div><div>')}
									</div>
								</div>
								<div class="card-text text-muted timestamp">
									{DateTime.fromISO(todo.createdAt.toString()).toFormat('dd MMM, yyyy hh:mm a')}
								</div>
							</div>
							<div class="col-auto">
								{#if !todo.completed}
									<button class="btn btn-sm btn-outline-success" on:click={() => onUpdateTodoStatus(todo._id, true)}> Mark Complete </button>
								{:else}
									<button class="btn btn-sm btn-outline-secondary" on:click={() => onUpdateTodoStatus(todo._id, false)}> Mark Active </button>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<div class="card bg-light border-0 shadow-none">
				<div class="card-body text-center">
					<div class="h1">Hurray!</div>
					<div class="h3 fw-light">Have a cup of tea.</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.timestamp {
		font-size: 0.75rem;
	}
</style>
