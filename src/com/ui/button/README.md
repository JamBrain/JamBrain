# UIButton
The UIButton is a generic button type. It contains no styles. Use it as you would a `<div>`, and the contents will act like a button.

* UIButton - **Prefer this!** This will use the correct version below depending on whether you set an `href` property
  * UIButtonDiv - a standard button in a `<div>` block
  * UIButtonLink - a standard button in a `<UILink>` block (i.e. `<a>`)

As for styles, you can assume all buttons will have a `ui-button` class, even if you use `UIButtonDiv` or `UIButtonLink` directly.
