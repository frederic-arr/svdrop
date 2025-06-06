import { getContext } from 'svelte';

export const DRAGGABLE = Symbol('draggable');

export type DraggableContext = typeof import('@shopify/draggable');

export function getDraggable(): Promise<Awaited<DraggableContext>> {
	return getContext(DRAGGABLE);
}
