<script lang="ts">
	import { Provider, Sortable } from '$lib/index.js';

	let value = $state(true);
	let data = $state([
		{
			id: 'a',
			name: 'Column A',
			data: [
				{ id: 'a1', name: 'A1', color: '#7193f1' },
				{ id: 'a2', name: 'A2', color: '#7193f1' },
				{ id: 'a3', name: 'A3', color: '#7193f1' }
			]
		},
		{
			id: 'b',
			name: 'Column B',
			data: [
				{ id: 'b1', name: 'B1', color: '#ffda6c' },
				{ id: 'b2', name: 'B2', color: '#ffda6c' },
				{ id: 'b3', name: 'B3', color: '#ffda6c' }
			]
		},
		{
			id: 'c',
			name: 'Column C',
			data: [
				{ id: 'c1', name: 'C1', color: '#00bcd4' },
				{ id: 'c2', name: 'C2', color: '#00bcd4' },
				{ id: 'c3', name: 'C3', color: '#00bcd4' }
			]
		}
	]);
</script>

<input type="checkbox" bind:checked={value} />

<Provider>
	<Sortable handles={value} animate={true}>
		{#snippet children({ addContainer: addBoardsContainer, draggable: boardClass, handle })}
			<Sortable>
				{#snippet children({ addContainer: addBoard, draggable: taskClass })}
					<ul {@attach addBoardsContainer(data)} class="container">
						{#each data as board (board.id)}
							<li class={boardClass}>
								<div class="column shadow content">
									<span class="header {handle}">{board.name}</span>
									<ul class="board" {@attach addBoard(board.data)}>
										{#each board.data as task (task.id)}
											<li class=" {taskClass}" style="--color: {task.color}">
												<div class="task shadow">
													<span class="indicator"></span>
													<span>{task.name}</span>
												</div>
											</li>
										{/each}
									</ul>
								</div>
							</li>
						{/each}
					</ul>
				{/snippet}
			</Sortable>
		{/snippet}
	</Sortable>
</Provider>

<pre>{JSON.stringify(data, null, 2)}</pre>

<style>
	* {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	ul {
		list-style: none;
	}

	.column {
		border-radius: 0.5rem;
		overflow: hidden;
		width: 240px;
		border: 1px solid #e9e9e9;
		height: min-content;
	}

	.header {
		display: block;
		padding: 0.5rem 1rem;
		border-bottom: 1px solid #e9e9e9;
		background-color: white;
		cursor: grab;
	}

	.board {
		padding: 1rem;
		display: grid;
		flex-direction: column;
		row-gap: 0.5rem;
	}

	.task {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem;
		background-color: white;
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		padding-left: 0.5rem;
		cursor: grab;
		opacity: 100%;
	}

	.indicator {
		display: block;
		background-color: var(--color);
		width: 0.25rem;
		height: 100%;
		border-radius: 1rem;
	}

	@keyframes shadow {
		0% {
			box-shadow: rgba(0, 0, 0, 0.0) 0px 5px 15px;
		}

		100% {
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		}
	}

	.content {
		/* transition: background-color 150ms ease; */
		background-color: rgb(246, 246, 246);
	}

	.draggable-mirror > .shadow {
		animation: shadow 150ms both;
		/* box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; */
	}

	.draggable-source--is-dragging {
		opacity: 50%;
	}

	.column:has(.draggable-container--over) .content {
		background-color: rgb(235, 235, 235);
	}

	.container {
		margin: 120px;
		display: flex;
		gap: 16px;
	}
</style>
