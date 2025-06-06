<script lang="ts">
	import { onMount, setContext, type Snippet } from 'svelte';
	import { DRAGGABLE } from './context.js';

	const { children = undefined }: { children?: Snippet<[]> } = $props();

	let resolve: (value: unknown) => void;
	let reject: (reason?: any) => void;
	setContext(
		DRAGGABLE,
		new Promise((_resolve, _reject) => {
			resolve = _resolve;
			reject = _reject;
		})
	);

	onMount(() => {
		// This is a client-only import
		// Unfortunately, when importing, it executes some code and accesses
		// the window object
		import('@shopify/draggable').then(resolve).catch(reject);
	});
</script>

{@render children?.()}
