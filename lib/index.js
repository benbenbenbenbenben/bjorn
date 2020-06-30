"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bjorn = void 0;
var reflect = require('js-function-reflector');
var SKIP = Symbol("skip");
var OPTIONAL = Symbol("optional");
Object.defineProperties(Function.prototype, {
    "many": {
        get: function () {
            var _this = this;
            var f = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var i = args.findIndex(function (v) { return !_this(v); });
                return i >= 0 ? i : false;
            };
            Object.defineProperty(f, "name", { value: this.name });
            Object.defineProperty(f, OPTIONAL, { value: true });
            if (this[SKIP]) {
                Object.defineProperty(f, SKIP, { value: true });
            }
            return f;
        }
    },
    "skip": {
        get: function () {
            Object.defineProperty(this, SKIP, { value: true });
            return this;
        }
    }
});
exports.bjorn = function (sequence, options) {
    if (options === void 0) { options = { seek: false, exhaustive: false }; }
    return function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        /*if (options.seek) {
            patterns = patterns.map(pattern => pattern[0][SKIP] && pattern[0][OPTIONAL] ? pattern : [
                (x => !pattern[0](x)).skip.many, ...pattern
            ])
        }*/
        var searchsequence = sequence;
        do {
            var _loop_1 = function (pattern) {
                var matches = [];
                var parameters = {};
                for (var i = 0, j = 0, k = 0; i < pattern.length - 1; i++, j++) {
                    var sequenceLength = 0;
                    if (sequenceLength = pattern[i].apply(pattern, searchsequence.slice(j)) | 0) {
                        if (pattern[i][SKIP] === undefined) {
                            parameters[k++] = parameters[pattern[i].name] = sequenceLength === 1 ? searchsequence[j] : searchsequence.slice(j, j + sequenceLength);
                        }
                        j += sequenceLength - 1;
                    }
                    else if (pattern[i][OPTIONAL]) {
                        // rewind optional match miss
                        j--;
                    }
                    else {
                        break;
                    }
                    if (i === pattern.length - 2) {
                        parameters["tail"] = searchsequence.slice(j + 1);
                        var spec = reflect(pattern[i + 1]);
                        var call = spec.params.map(function (p, i) { return parameters.hasOwnProperty(p.name) ? parameters[p.name] : parameters[i]; });
                        if (options.exhaustive) {
                            matches.push(pattern[i + 1].apply(undefined, call));
                            var next = exports.bjorn(searchsequence.slice(j + 1), options).apply(void 0, patterns);
                            if (next !== undefined) {
                                matches.push.apply(matches, next);
                            }
                        }
                        else {
                            return { value: pattern[i + 1].apply(undefined, call) };
                        }
                    }
                }
                if (matches.length) {
                    return { value: matches };
                }
            };
            for (var _a = 0, patterns_1 = patterns; _a < patterns_1.length; _a++) {
                var pattern = patterns_1[_a];
                var state_1 = _loop_1(pattern);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        } while (options.seek && (searchsequence = searchsequence.slice(1)).length);
    };
};
