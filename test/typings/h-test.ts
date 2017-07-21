import { h, patch, Component, VNode } from "../../picodom";

// empty vnode
h("div")

// vnode with a single child
h("div", {}, ["foo"])
h("div", {}, "foo")

// positional String/Number children
h("div", {}, "foo", "bar", "baz")
h("div", {}, 1, "foo", 2, "baz", 3)
h("div", {}, "foo", h("div", {}, "bar"), "baz", "quux")

// vnode with data
interface TestData {
    id: string;
    class: string;
    style: { color: string; }
}

const data: TestData = {
  id: "foo",
  class: "bar",
  style: {
    color: "red"
  }
}

h("div", data, "baz")

// skip null and Boolean children
// these throw a compiler error by design
// h("div", {}, true)
// h("div", {}, false)
// h("div", {}, null)


// component tests
interface WrapperProps {
    attr1: string;
}

const Component: Component<any> = (data, children) => h("div", data, children)
const Wrapper: Component<WrapperProps> = (data, children) => h("div", data, children.map(vn => h(Component, null, vn)))

h(Component, { id: "foo" }, "bar")
h(Component, { id: "foo" }, [h(Component, { id: "bar" })])
h(Wrapper, { attr1: "foo" }, [
  h("span", { id: "child1" }),
  h("span", { id: "child2" })
])
