const reflect = require('js-function-reflector');

const SKIP = Symbol("skip")
const OPTIONAL = Symbol("optional")

Object.defineProperties(Function.__proto__, {
    "many": {
        get: function () {
            let f = (...args) => {
                const i = args.findIndex(v => !this(v))
                return i >= 0 ? i : false
            }
            Object.defineProperty(f, "name", { value: this.name })
            Object.defineProperty(f, OPTIONAL, { value: true })
            if (this[SKIP]) {
                Object.defineProperty(f, SKIP, { value: true })
            }
            return f
        }
    },
    "skip": {
        get: function () {
            Object.defineProperty(this, SKIP, { value: true })
            return this
        }
    }
})

const bjorn = (sequence, options = {seek:false}) => (...patterns) => {
    if (options.seek) {
        patterns = patterns.map(pattern => pattern[0][SKIP] && pattern[0][OPTIONAL] ? pattern : [
            (x => !pattern[0](x)).skip.many, ...pattern    
        ])
    }
    for (const pattern of patterns) {
        let matches = []
        let parameters = {}
        for (let i = 0, j = 0, k = 0; i < pattern.length - 1; i++, j++) {
            let sequenceLength = 0
            if (sequenceLength = pattern[i](...sequence.slice(j)) | 0) {
                if (pattern[i][SKIP] === undefined) {
                    parameters[k++] = parameters[pattern[i].name] = sequenceLength === 1 ? sequence[j] : sequence.slice(j, j + sequenceLength)
                }
                j += sequenceLength - 1
            } else if (pattern[i][OPTIONAL]) {
                // rewind optional match miss
                j--
            } else {
                "break" // ?
                break
            }
            if (i === pattern.length - 2) {
                parameters["tail"] = sequence.slice(j + 1)
                const spec = reflect(pattern[i + 1])
                const call = spec.params.map((p, i) => parameters.hasOwnProperty(p.name) ? parameters[p.name] : parameters[i])
                if (options.exhaustive) {
                    matches.push(pattern[i + 1].apply(undefined, call));
                    const next = bjorn(sequence.slice(j + 1), options)(...patterns);
                    if (next !== undefined) {
                        matches.push(...next)
                    }
                } else {
                    return pattern[i + 1].apply(undefined, call)
                }
            }
        }
        if (matches.length) {
            return matches
        }
    }
}

module.exports = bjorn