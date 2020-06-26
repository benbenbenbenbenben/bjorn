# Björn Pattern Matching

Björn is a JavaScript native array pattern matcher that uses predicates to find sequences within sequences. It gives you practical and no-bloat no-bullshit pattern matching over arrays.

## Installation

`npm install bjorn`

## Usage

```const bjorn = require("bjorn");```

## Examples

### Björn finds arrays within arrays:

```javascript
const bjorn = require("./index")

const p0 = x => x === 0;
const p1 = x => x === 1;
const p2 = x => x === 2;

const seq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

bjorn(seq)(
    [ p0, p1, p2, (p0, tail) => console.log(p0, tail)]
);
// 0, [3, 4, 5, 6, 7, 8, 9]
```
