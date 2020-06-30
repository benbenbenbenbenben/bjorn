import { bjorn } from ".";

describe("bjorn", () => {
    const p0 = () => true;
    const p1 = () => true;
    const p2 = () => true;

    const p012 = [p0, p1, p2];

    const zero = (x: number) => x === 0;
    const one = (x: number) => x === 1;
    const two = (x: number) => x === 2;
    const three = (x: number) => x === 3;
    const four = (x: number) => x === 4;
    const five = (x: number) => x === 5;
    const six = (x: number) => x === 6;
    const seven = (x: number) => x === 7;
    const eight = (x: number) => x === 8;
    const nine = (x: number) => x === 9;

    const seq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    test("named", () => {
        bjorn(seq)(
            [p0, p1, p2, (p0: any, tail: any) => {
                expect(p0).toBe(0)
                expect(tail).toStrictEqual(seq.slice(3))
            }]
        )
    })

    test("named skipping one", () => {
        bjorn(seq)(
            [p0, p1, p2, (p1: any, tail: any) => {
                expect(p1).toBe(1)
                expect(tail).toStrictEqual(seq.slice(3))
            }]
        )
    })

    test("positional", () => {
        bjorn(seq)(
            [p0, p1, p2, (a: any, b: any, c: any, tail: any) => {
                expect(b).toBe(1)
                expect(tail).toStrictEqual(seq.slice(3))
            }]
        )
    })

    test("splat", () => {
        bjorn(seq)(
            [...[p0, p1, p2], (p0: any, tail: any) => {
                expect(p0).toBe(0)
                expect(tail).toStrictEqual(seq.slice(3))
            }]
        )
        bjorn(seq)(
            [...p012, (p0: any, tail: any) => {
                expect(p0).toBe(0)
                expect(tail).toStrictEqual(seq.slice(3))
            }]
        )

    })

    test("many utility", () => {
        bjorn([0, 0, 0, ...seq])(
            [zero.many, (zero: any, tail: any) => {
                expect(zero).toStrictEqual([0, 0, 0, 0])
                expect(tail).toStrictEqual(seq.slice(1))
            }]
        )
    })

    test("skip utility", () => {
        bjorn(seq)(
            [zero.skip, p0, (a: any, tail: any) => {
                expect(a).toBe(1)
                expect(tail).toStrictEqual(seq.slice(2))
            }]
        )
    })

    test("skip utility", () => {
        bjorn([1, ...seq], {seek:true})(
            [zero.skip, p0, (a: any, tail: any) => {
                expect(a).toBe(1)
                expect(tail).toStrictEqual(seq.slice(2))
            }]
        )
    })


    test("many.skip utility", () => {
        bjorn([0,0,0,0,1,2,3,4])(
            [zero.many.skip, p0, (a: any, tail: any) => {
                expect(a).toBe(1)
                expect(tail).toStrictEqual([2,3,4])
            }]
        )
    })

    test("skip.many utility", () => {
        bjorn([0,0,0,0,1,2,3,4])(
            [zero.skip.many, p0, (a: any, tail: any) => {
                expect(a).toBe(1)
                expect(tail).toStrictEqual([2,3,4])
            }]
        )
    })

    test("skip many utility", () => {
        const a = bjorn([0,0,0,0,1,2,3,4])(
            [zero.many.skip, p0, (a: any, tail: any) => a]
        )
        expect(a).toBe(1)
        const b = bjorn([0,0,0,0,1,2,3,4])(
            [(x: any) => false],
            [zero.many.skip, p0, (tail: any) => tail]
        )
        expect(b).toStrictEqual([2,3,4])
    })

    test("seek", () => {
        const a = bjorn([0, 1, 2], {seek:true})(
            [(x: number) => x == 2, (a: any) => a]
        )
        expect(a).toBe(2)

        const b = bjorn([0, 1, 2])(
            [(x: number) => x == 2, (a: any) => a]
        )
        expect(b).toBe(undefined)

        const c = bjorn([0, 1, 2], {seek:true})(
            [(x: number) => x == 0, (a: any) => a]
        )
        expect(c).toBe(0)
    })

    test("exhaustive", () => {
        const zero = (x: number) => x == 0
        const a = bjorn([3,2,1,0,0,3,2,1,0,0,3,2,1], {seek:true, exhaustive:true})(
            [zero, zero, (a: any, b: any) => [a, b]]
        )
        expect(a).toStrictEqual(
           [[0,0],[0,0]]
        )

    })

    test("exhaustive singles", () => {
        const zero = (x: number) => x == 0
        const a = bjorn([3,2,1,0,0,3,2,1,0,0,3,2,1], {seek:true, exhaustive:true})(
            [zero, (a: any) => a]
        )
        a // ?
        expect(a).toStrictEqual(
           [0, 0, 0, 0]
        )

    })

    test("seek second", () => {
        const a = bjorn(seq, {seek:true})(
            [eight, nine, (a: any,b: any) => [a,b]],
            [three, four, (a: any,b: any) => [a,b]]
        )
        expect(a).toStrictEqual([3,4])
    })
}) 