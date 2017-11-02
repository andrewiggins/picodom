import { h, Component } from "../../"

// empty vnode
h("div")

// null children are allowed and useful when conditionally rendering children
h("div", {}, null)

// vnode with a single child
h("div", {}, ["foo"])
h("div", {}, "foo")
h("div", {}, [h("div")])
h("div", {}, h("div"))

// positional String/Number children
h("div", {}, "foo", "bar", "baz")
h("div", {}, 1, "foo", 2, "baz", 3)
h("div", {}, "foo", h("div", {}, "bar"), "baz", "quux")

// vnode with props
export interface TestProps {
  id: string
  class: string
  style: { color: string }
}

export const props: TestProps = {
  id: "foo",
  class: "bar",
  style: {
    color: "red"
  }
}

h("div", props, "baz")

// component tests
export const Test: Component<any> = (props, children) =>
  h("div", props, children)
export const Wrapper: Component<TestProps> = (props, children) =>
  h("div", props, children.map(vn => h(Test, null, vn)))

// the following line, while it isn't type correct (Wrapper requires type TestProps for props), it is allowed
// because the type of `h` defines the `props` param as optional
h(Wrapper)

h(Test)
h(Test, { id: "foo" }, "bar")
h(Test, { id: "foo" }, [h(Test, { id: "bar" })])
h(Wrapper, props, [
  h("span", { "data-attr": "child1" }),
  h("span", { "data-attr": "child2" })
])

let element: JSX.Element
element = (
  <Wrapper {...props}>
    <Test />
  </Wrapper>
)
element = (
  <Wrapper {...props}>
    <span id="child1">Child 1</span>
    <span id="child2">Child 2</span>
  </Wrapper>
)
