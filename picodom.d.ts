export as namespace picodom

export interface VirtualNode<Data> {
  tag: string;
  data: Data;
  children: Array<VirtualNode<{}> | string>;
}

export interface VirtualComponent<Data> {
  (data: Data, children: Array<VirtualNode<{}> | string>): VirtualNode<Data>
}

export function h<Data>(
  tag: VirtualComponent<Data> | string,
  data?: Data,
  children?: Array<VirtualNode<{}> | string | number>
): VirtualNode<Data>
export function h<Data>(
  tag: VirtualComponent<Data> | string,
  data?: Data,
  ...children: Array<VirtualNode<{}> | string | number>
): VirtualNode<Data>

export function patch(
  oldNode: VirtualNode<{}> | null,
  newNode: VirtualNode<{}>,
  element: Element | null,
  parent: Element | null
): Element

declare global {
  namespace JSX {
    interface Element<Data = any> extends VirtualNode<Data> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
