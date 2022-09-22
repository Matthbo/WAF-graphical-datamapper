import { Endpoint, UIGroup } from "@jsplumb/core";

export type Node<E extends HTMLElement> = {
  element: E;
  endpoint: Endpoint<E>;
}

export type GroupNode<E extends HTMLElement> = {
  element: E;
  group: UIGroup<E>
  children: (GroupNode<HTMLElement> | Node<HTMLElement>)[];
}

export type NodeMapInfo<T> = {
  parentNode: NodeMapInfo<object> | null; // can be object or array
  key: string;
  type: string;
  value: T
}

export interface Mapping<T> {
  sourceNode: NodeMapInfo<T>;
  targetNode: NodeMapInfo<T>;
  transformation?: unknown;
  condition?: unknown;
  toSerializable: () => SerializableMapping<T>;
}

export type SerializableNodeMapInfo<T> = {
  parentPath: string;
  key: string;
  type: string;
  value: T
}

export type SerializableMapping<T> = {
  sourceNode: SerializableNodeMapInfo<T>;
  targetNode: SerializableNodeMapInfo<T>;
}
