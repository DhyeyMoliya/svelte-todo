<script lang="ts">
	import { DateTime } from 'luxon';
	import type { ITask } from '$lib/models/task';
	import type { PageData } from './$types';

	export let data: PageData;

	let adding = false;
</script>

<h1 class="text-center mb-4">To Do Manager</h1>
<section class="row justify-content-center mb-3">
	<div class="col-8">
		<div class="card shadow shadow-sm mb-3 ">
			<div class="card-body">
				<div class="row">
					<div class="col">
						<h4 class="card-title">Task 1</h4>
						<div class="card-text text-muted mb-2">Task 1 Description</div>
						<div class="card-text text-muted timestamp">
							{DateTime.fromJSDate(new Date()).toFormat('dd MMM, yyyy hh:mm a')}
						</div>
					</div>
					<div class="col-auto">
						<button class="btn btn-sm btn-outline-primary"> Mark Complete </button>
					</div>
				</div>
			</div>
		</div>
		<div class="card mb-3 bg-light border-0">
			<div class="card-body">
				<div class="row">
					<div class="col">
						<h4 class="card-title text-decoration-line-through">Task 2</h4>
						<div class="card-text text-muted text-decoration-line-through mb-2">Task 2 Description</div>
						<div class="card-text text-muted timestamp">
							{DateTime.fromJSDate(new Date()).toFormat('dd MMM, yyyy hh:mm a')}
						</div>
					</div>
					<div class="col-auto">
						<button class="btn btn-sm btn-outline-secondary"> Mark Active </button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
<section class="row justify-content-center mb-3">
	{#if !adding}
		<div class="col-auto">
			<button
				class="btn btn-outline-primary"
				type="button"
				on:click={() => {
					adding = true;
				}}>New Task</button>
		</div>
	{:else}
		<div class="col-6">
			<form class="border shadow-sm shadow-primary rounded p-3 bg-light">
				<h3>Create New Task</h3>
				<div class="mb-3">
					<label for="new-task-title" class="form-label">Task Title</label>
					<input type="text" class="form-control" id="new-task-title" />
				</div>
				<div class="mb-3">
					<label for="new-task-description" class="form-label">Task Description</label>
					<textarea rows="4" class="form-control" id="new-task-description" />
				</div>
				<div class="text-center">
					<button
						class="btn btn-primary"
						type="button"
						on:click={() => {
							adding = false;
						}}>Create To Do</button>
					<button
						class="btn btn-outline-secondary"
						type="button"
						on:click={() => {
							adding = false;
						}}>Cancel</button>
				</div>
			</form>
		</div>
	{/if}
</section>

<style>
	.timestamp {
		font-size: 0.75rem;
	}
</style>
