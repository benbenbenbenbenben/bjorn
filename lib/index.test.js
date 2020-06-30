"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
describe("bjorn", function () {
    var p0 = function () { return true; };
    var p1 = function () { return true; };
    var p2 = function () { return true; };
    var p012 = [p0, p1, p2];
    var zero = function (x) { return x === 0; };
    var one = function (x) { return x === 1; };
    var two = function (x) { return x === 2; };
    var three = function (x) { return x === 3; };
    var four = function (x) { return x === 4; };
    var five = function (x) { return x === 5; };
    var six = function (x) { return x === 6; };
    var seven = function (x) { return x === 7; };
    var eight = function (x) { return x === 8; };
    var nine = function (x) { return x === 9; };
    var seq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    test("named", function () {
        _1.bjorn(seq)([p0, p1, p2, function (p0, tail) {
                expect(p0).toBe(0);
                expect(tail).toStrictEqual(seq.slice(3));
            }]);
    });
    test("named skipping one", function () {
        _1.bjorn(seq)([p0, p1, p2, function (p1, tail) {
                expect(p1).toBe(1);
                expect(tail).toStrictEqual(seq.slice(3));
            }]);
    });
    test("positional", function () {
        _1.bjorn(seq)([p0, p1, p2, function (a, b, c, tail) {
                expect(b).toBe(1);
                expect(tail).toStrictEqual(seq.slice(3));
            }]);
    });
    test("splat", function () {
        _1.bjorn(seq)(__spreadArrays([p0, p1, p2], [function (p0, tail) {
                expect(p0).toBe(0);
                expect(tail).toStrictEqual(seq.slice(3));
            }]));
        _1.bjorn(seq)(__spreadArrays(p012, [function (p0, tail) {
                expect(p0).toBe(0);
                expect(tail).toStrictEqual(seq.slice(3));
            }]));
    });
    test("many utility", function () {
        _1.bjorn(__spreadArrays([0, 0, 0], seq))([zero.many, function (zero, tail) {
                expect(zero).toStrictEqual([0, 0, 0, 0]);
                expect(tail).toStrictEqual(seq.slice(1));
            }]);
    });
    test("skip utility", function () {
        _1.bjorn(seq)([zero.skip, p0, function (a, tail) {
                expect(a).toBe(1);
                expect(tail).toStrictEqual(seq.slice(2));
            }]);
    });
    test("skip utility", function () {
        _1.bjorn(__spreadArrays([1], seq), { seek: true })([zero.skip, p0, function (a, tail) {
                expect(a).toBe(1);
                expect(tail).toStrictEqual(seq.slice(2));
            }]);
    });
    test("many.skip utility", function () {
        _1.bjorn([0, 0, 0, 0, 1, 2, 3, 4])([zero.many.skip, p0, function (a, tail) {
                expect(a).toBe(1);
                expect(tail).toStrictEqual([2, 3, 4]);
            }]);
    });
    test("skip.many utility", function () {
        _1.bjorn([0, 0, 0, 0, 1, 2, 3, 4])([zero.skip.many, p0, function (a, tail) {
                expect(a).toBe(1);
                expect(tail).toStrictEqual([2, 3, 4]);
            }]);
    });
    test("skip many utility", function () {
        var a = _1.bjorn([0, 0, 0, 0, 1, 2, 3, 4])([zero.many.skip, p0, function (a, tail) { return a; }]);
        expect(a).toBe(1);
        var b = _1.bjorn([0, 0, 0, 0, 1, 2, 3, 4])([function (x) { return false; }], [zero.many.skip, p0, function (tail) { return tail; }]);
        expect(b).toStrictEqual([2, 3, 4]);
    });
    test("seek", function () {
        var a = _1.bjorn([0, 1, 2], { seek: true })([function (x) { return x == 2; }, function (a) { return a; }]);
        expect(a).toBe(2);
        var b = _1.bjorn([0, 1, 2])([function (x) { return x == 2; }, function (a) { return a; }]);
        expect(b).toBe(undefined);
        var c = _1.bjorn([0, 1, 2], { seek: true })([function (x) { return x == 0; }, function (a) { return a; }]);
        expect(c).toBe(0);
    });
    test("exhaustive", function () {
        var zero = function (x) { return x == 0; };
        var a = _1.bjorn([3, 2, 1, 0, 0, 3, 2, 1, 0, 0, 3, 2, 1], { seek: true, exhaustive: true })([zero, zero, function (a, b) { return [a, b]; }]);
        expect(a).toStrictEqual([[0, 0], [0, 0]]);
    });
    test("exhaustive singles", function () {
        var zero = function (x) { return x == 0; };
        var a = _1.bjorn([3, 2, 1, 0, 0, 3, 2, 1, 0, 0, 3, 2, 1], { seek: true, exhaustive: true })([zero, function (a) { return a; }]);
        a; // ?
        expect(a).toStrictEqual([0, 0, 0, 0]);
    });
    test("seek second", function () {
        var a = _1.bjorn(seq, { seek: true })([eight, nine, function (a, b) { return [a, b]; }], [three, four, function (a, b) { return [a, b]; }]);
        expect(a).toStrictEqual([3, 4]);
    });
});
