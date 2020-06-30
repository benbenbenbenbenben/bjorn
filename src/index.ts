const reflect = require('js-function-reflector');

const SKIP = Symbol("skip")
const OPTIONAL = Symbol("optional")

Object.defineProperties(Function.prototype, {
    "many": {
        get: function () {
            let f = (...args: any[]) => {
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

type options = {
    seek?:boolean
    exhaustive?:boolean
}

export const bjorn = (sequence:any[], options:options = {seek:false, exhaustive:false}) => (...patterns:any[][]):any => {
    /*if (options.seek) {
        patterns = patterns.map(pattern => pattern[0][SKIP] && pattern[0][OPTIONAL] ? pattern : [
            (x => !pattern[0](x)).skip.many, ...pattern    
        ])
    }*/
    let searchsequence = sequence
    do {
        for (const pattern of patterns) {
            let matches = []
            let parameters:any = {}
            
            for (let i = 0, j = 0, k = 0; i < pattern.length - 1; i++, j++) {
                let sequenceLength = 0
                if (sequenceLength = pattern[i](...searchsequence.slice(j)) | 0) {
                    if (pattern[i][SKIP] === undefined) {
                        parameters[k++] = parameters[pattern[i].name] = sequenceLength === 1 ? searchsequence[j] : searchsequence.slice(j, j + sequenceLength)
                    }
                    j += sequenceLength - 1
                } else if (pattern[i][OPTIONAL]) {
                    // rewind optional match miss
                    j--
                } else {
                    break
                }
                if (i === pattern.length - 2) {
                    parameters["tail"] = searchsequence.slice(j + 1)
                    const spec = reflect(pattern[i + 1])
                    const call = spec.params.map((p: { name: string | number; }, i: string | number) => parameters.hasOwnProperty(p.name) ? parameters[p.name] : parameters[i])
                    if (options.exhaustive) {
                        matches.push(pattern[i + 1].apply(undefined, call));
                        const next = bjorn(searchsequence.slice(j + 1), options)(...patterns);
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
    } while(options.seek && (searchsequence = searchsequence.slice(1)).length)
    
}