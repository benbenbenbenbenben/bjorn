const reflect = require('js-function-reflector');

Object.defineProperty(Function.__proto__, "many", {
    get: function () {
        let f = (...args) => {
            const i = args.findIndex(v => !this(v))
            return i >= 0 ? i : false
        }
        Object.defineProperty(f, "name", { value: this.name })
        return f
    }
})

const bjorn = sequence => (...patterns) => {
    for (const pattern of patterns) {
        let parameters = {}
        for (let i = 0, j = 0; i < pattern.length - 1; i++, j++) {
            let sequenceLength = 0
            if (sequenceLength = pattern[i](...sequence.slice(j)) | 0) {
                parameters[i] = parameters[pattern[i].name] = sequenceLength === 1 ? sequence[j] : sequence.slice(j, j + sequenceLength)
                j += sequenceLength - 1
            } else {
                break
            }
            if (i === pattern.length - 2) {
                parameters["tail"] = sequence.slice(j + 1)
                const spec = reflect(pattern[i + 1])
                const call = spec.params.map((p, i) => parameters.hasOwnProperty(p.name) ? parameters[p.name] : parameters[i])
                pattern[i + 1].apply(undefined, call)
            }
        }
    }
}

module.exports = bjorn