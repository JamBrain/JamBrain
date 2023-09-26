# Shallow

Modified version of shallow-compare. I got tired of having to hack access to the Diff code. Exposes Compare and Diff equally.

Original code: https://github.com/developit/preact-compat/blob/master/src/index.js#L378
Based on: https://github.com/tkh44/shallow-compare

##Example
```javascript
// preact
import { Component, h } from 'preact'
import shallow from 'shallow'

class Foo extends Component {
  constructor( props ) {
    super(props);
    this.state = { color: 'blue' }
  }

  shouldComponentUpdate( nextProps, nextState ) {
    return shallow.Compare(this, nextProps, nextState)
  }

  render() {
    return <div>{this.state.color}</div>
  }
}
```
