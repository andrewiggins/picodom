export as namespace picodom

export interface VirtualNode<Data> {
  tag: string
  data: Data
  children: VElement<{}>[]
}

export interface Component<Data> {
  (data: Data, children: VElement<{}>[]): VirtualNode<any>
}

export type VElement<Data> = VirtualNode<Data> | string

export function h<Data>(
  tag: Component<Data> | string,
  data?: Data,
  children?: Array<VElement<{}> | number>
): VirtualNode<Data>

export function h<Data>(
  tag: Component<Data> | string,
  data?: Data,
  ...children: Array<VElement<{}> | number>
): VirtualNode<Data>

export function patch(
  parent: Element,
  element: Element | null,
  oldNode: VirtualNode<{}> | null,
  node: VirtualNode<{}>
): Element

declare global {
  namespace JSX {
    interface Element<Data=any> extends VirtualNode<Data> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
