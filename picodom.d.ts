export as namespace picodom

export interface VNode<Data> {
  tag: string
  data?: Data
  children: VElement<{}>[]
}

export interface Component<Data> {
  (data: Data, children: VElement<{}>[]): VNode<Data>
}

export type VElement<Data> = VNode<Data> | string

export function h<Data>(
  tag: Component<Data> | string,
  data?: Data,
  children?: Array<VElement<{}> | number>
): VNode<Data>

export function h<Data>(
  tag: Component<Data> | string,
  data?: Data,
  ...children: Array<VElement<{}> | number>
): VNode<Data>

export function patch(
  parent: Element,
  element: Element | null,
  oldNode: VNode<{}> | null,
  node: VNode<{}>
): Element

declare global {
  namespace JSX {
    interface Element<Data=any> extends VNode<Data> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
