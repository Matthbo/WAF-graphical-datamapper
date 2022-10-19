import { Endpoint, UIGroup } from "@jsplumb/core";

export type Node<E extends HTMLElement> = {
  element: E;
  path: string;
  endpoint: Endpoint<E>;
}

export type GroupNode<E extends HTMLElement> = {
  element: E;
  path: string;
  group: UIGroup<E>
  children: (GroupNode<HTMLElement> | Node<HTMLElement>)[];
}

export type NodeMapInfo = {
  parentNode: NodeMapInfo | null; // can be object or array
  key: string;
  type: string;
}

export interface Mapping {
  sourceNode: NodeMapInfo;
  targetNode: NodeMapInfo;
  transformation?: unknown;
  condition?: unknown;
  toSerializable: () => SerializableMapping;
}

export type SerializableNodeMapInfo = {
  parentPath: string;
  key: string;
  type: string;
}

export type SerializableMapping = {
  sourceNode: SerializableNodeMapInfo;
  targetNode: SerializableNodeMapInfo;
}
