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

/**
 * A function to create picodom virtual nodes
 * @param tag The Component or string of the virtual node to create
 * @param data The data to store in the virutal node
 * @param children The children of the virtual node
 */
export function h<Data>(
  tag: Component<Data> | string,
  data?: Data,
  children?: Array<VElement<{}> | number>
): VirtualNode<Data>

/**
 * @deprecated Use the children array version of h for better performance. 
 * This overload primarly exists for JSX support only.
 * @param tag The Component or string of the virtual node to create
 * @param data The data to store in the virutal node
 * @param children The children of the virtual node
 */
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
