
```js
<Router>
	<Route />
	<Route path="/edit" />
</Router>
```

* Black hole routes (i.e. return nothing)
* Multiple error routes (first encountered)

Route is the last encountered, or Error route if none found.
Error route is the first encountered.
