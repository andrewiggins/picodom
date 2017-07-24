import { h, patch, Component } from "../../picodom";

// empty vnode
h("div")

// vnode with a single child
h("div", {}, ["foo"])
h("div", {}, "foo")
h("div", {}, [h("div")])
h("div", {}, h("div"))

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
const Test: Component<any> = (data, children) => h("div", data, children)
const Wrapper: Component<TestData> = (data, children) => h("div", data, children.map(vn => h(Test, null, vn)))

// The following line, while it isn't type correct (Wrapper requires type TestData for data), it is allowed
// because the type of `h` defines the `data` param as optional
h(Wrapper);
// The following line should throw a compiler error since {id: "foo"} doesn't match the required type TestData
// h(Wrapper, { id: "foo" });
h(Test);
h(Test, { id: "foo" }, "bar")
h(Test, { id: "foo" }, [h(Test, { id: "bar" })])
h(Wrapper, data, [
  h("span", { id: "child1" }),
  h("span", { id: "child2" })
])
