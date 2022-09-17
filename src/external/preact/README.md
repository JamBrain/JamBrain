## Preact
<https://github.com/preactjs/preact>

* `/src/` is `/preact/`
* `/debug/src/` is `/debug/`
* `/hooks/src/` is `/hooks/`
* `/devtools/src/` is `/devtools/`

When upgrading, PreactX builds have a `/src/` folder. Copy that into the respected folder (`debug`, `hooks`, etc).


## Signals
<https://github.com/preactjs/signals>

Signals is a TypeScript library. Code is found in the `/packages/` folder under `/src/`.

* `/packages/preact/src/` is `/signals/`
* `/packages/core/src/` is `/signals-core/`

When upgrading, you need to make a couple small edits to `signals`. Notably it imports `@preact/signals-core`. Remove the `@`.
