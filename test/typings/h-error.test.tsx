import { Component, h } from "../../"
import { Wrapper } from "./h.test"

// skip null and Boolean children
// these throw a compiler error by design
h("div", {}, true)
h("div", {}, false)

// the following line should throw a compiler error since {id: "foo"}
// doesn't match the required type TestProps
h(Wrapper, { id: "foo" })

// the following two lines should throw a compile error since { id: "foo" }
// or empty doesn't match the required type TestProps
let element: JSX.Element
element = <Wrapper />
element = <Wrapper id="foo">bar</Wrapper>
