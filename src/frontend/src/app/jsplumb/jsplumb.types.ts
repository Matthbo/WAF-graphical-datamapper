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
