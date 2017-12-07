# UIButton
The `UIButton` is a generic button type. It contains no styles. Use it as you would a `<div>`, and the contents will act like a button. The types are interchangable, and though they might function differently, they should style identically (if not, it's a bug).

* `UIButton` - **Prefer this!** This will use the correct version below (i.e. if you include an `href` property, it'll use `UIButtonLink`)
  * `UIButtonDiv` - a standard button in a `<div>` block
  * `UIButtonLink` - a standard button in a `<UILink>` block (i.e. `<a>`)
  * `UIButtonButton` - a standard button in a `<button>` block

All buttons will have a `ui-button` class.
