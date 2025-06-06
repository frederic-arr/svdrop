<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { getDraggable } from '../provider/index.js';
	import type { DraggableOptions, Sortable, SortableEventNames } from '@shopify/draggable';
	import type { ReplaceAndLowercase } from '$lib/utils.js';

	type ChildrenData = {
		addContainer: (data: unknown[]) => Attachment;
		draggable: string;
		handle: string;
	};

	type EventNames = SortableEventNames;

	type Events = {
		[K in EventNames as `on${ReplaceAndLowercase<K, ':'>}`]?: Parameters<Sortable<K>['on']>[1];
	};

	type Props = {
		children?: Snippet<[ChildrenData]>;
		handles?: boolean;
		animate?: boolean;
		options?: Omit<
			DraggableOptions,
			'handle' | 'draggable' | 'collidables' | 'swapAnimation' | 'plugins'
		>;
	} & Events;

	const {
		children = undefined,
		handles = false,
		animate = true,
		options = {},
		...events
	}: Props = $props();
	let addContainer: ChildrenData['addContainer'] = $state(() => () => {});

	const uid = crypto.randomUUID().slice(0, 6);
	const draggableClass = `draggable-source-${uid}`;
	const handleClass = `draggable-handle-${uid}`;

	$effect(() => {
		let teardown = () => {};
		const handle = handles ? `.${handleClass}` : undefined;
		const addPlugins = animate;
		const map = new Map<HTMLElement, unknown[]>();

		getDraggable().then(({ Sortable, Plugins }) => {
			const sortable = new Sortable<EventNames>([], {
				// ...options,
				mirror: {
					constrainDimensions: true
					// ...options.mirror
				},
				draggable: `.${draggableClass}`,
				handle,
				plugins: addPlugins ? [Plugins.SortAnimation] : []
			});

			// sortable.on('draggable:initialize', (...data) => events.ondraggableinitialize?.(...data));
			// sortable.on('draggable:destroy', (...data) => events.ondraggabledestroy?.(...data));
			// sortable.on('drag:start', (...data) => events.ondragstart?.(...data));
			// sortable.on('drag:move', (...data) => events.ondragmove?.(...data));
			// sortable.on('drag:over', (...data) => events.ondragover?.(...data));
			// sortable.on('drag:over:container', (...data) => events.ondragovercontainer?.(...data));
			// sortable.on('drag:out', (...data) => events.ondragout?.(...data));
			// sortable.on('drag:out:container', (...data) => events.ondragoutcontainer?.(...data));
			// sortable.on('drag:stop', (...data) => events.ondragstop?.(...data));
			// sortable.on('drag:pressure', (...data) => events.ondragpressure?.(...data));
			// sortable.on('mirror:create', (...data) => events.onmirrorcreate?.(...data));
			// sortable.on('mirror:created', (...data) => events.onmirrorcreated?.(...data));
			// sortable.on('mirror:attached', (...data) => events.onmirrorattached?.(...data));
			// sortable.on('mirror:move', (...data) => events.onmirrormove?.(...data));
			// sortable.on('mirror:destroy', (...data) => events.onmirrordestroy?.(...data));
			// sortable.on('sortable:start', (...data) => events.onsortablestart?.(...data));
			// sortable.on('sortable:sort', (...data) => events.onsortablesort?.(...data));
			// sortable.on('sortable:sorted', (...data) => events.onsortablesorted?.(...data));
			// sortable.on('sortable:stop', (...data) => events.onsortablestop?.(...data));

			sortable.on('sortable:stop', async (data) => {
				const { oldIndex, oldContainer, newIndex, newContainer } = data;
				if (newContainer === oldContainer && newIndex === oldIndex) return;

				await tick();

				// Because draggable changes the DOM outside of Svelte,
				// Svelte cannot track that so we have to put the DOM back into
				// the shape that Svelte has, and let Svelte perform the final
				// modification for the reordering
				const currentElement = newContainer.children[newIndex];
				const oldPreviousElement = oldContainer.children[oldIndex];

				newContainer.removeChild(currentElement);
				if (oldIndex > newIndex) {
					oldPreviousElement.after(currentElement);
				} else if (oldIndex < newIndex) {
					oldPreviousElement.before(currentElement);
				}

				const newData = map.get(newContainer);
				const oldData = map.get(oldContainer);

				if (newData === undefined)
					throw new Error("Couldn't find associated data for the new container");
				if (oldData === undefined)
					throw new Error("Couldn't find associated data for the old container");

				const removed = oldData.splice(oldIndex, 1);
				newData.splice(newIndex, 0, removed[0]);
				// events.onsortablestop?.(data);
			});

			teardown = () => {
				sortable.destroy();
			};

			addContainer = (data) => {
				return (element) => {
					if (!(element instanceof HTMLElement)) return;
					if (data !== undefined) map.set(element, data);

					sortable.addContainer(element);

					return () => {
						map.delete(element);
						sortable.removeContainer(element);
					};
				};
			};
		});

		return () => teardown();
	});
</script>

{@render children?.({ addContainer, draggable: draggableClass, handle: handleClass })}
