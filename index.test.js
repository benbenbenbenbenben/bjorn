const bjorn = require("./index")

describe("bjorn", () => {
    const p0 = () => true;
    const p1 = () => true;
    const p2 = () => true;

    const p012 = [p0, p1, p2]

    const zero = x => x === 0;

    const seq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    test("named", () => {
        bjorn(seq)(
            [p0, p1, p2, (p0, tail) => {
                expect(p0).toBe(0)
                expect(tail).toStrictEqual(seq.slice(3))
            }]
        )
    })

    test("named skipping one", () => {
        bjorn(seq)(
            [p0, p1, p2, (p1, tail) => {
                expect(p1).toBe(1)
                expect(tail).toStrictEqual(seq.slice(3))
            }]
        )
    })

    test("positional", () => {
        bjorn(seq)(
            [p0, p1, p2, (a, b, c, tail) => {
                expect(b).toBe(1)
                expect(tail).toStrictEqual(seq.slice(3))
            }]
        )
    })

    test("splat", () => {
        bjorn(seq)(
            [...[p0, p1, p2], (p0, tail) => {
                expect(p0).toBe(0)
                expect(tail).toStrictEqual(seq.slice(3))
            }]
        )
        bjorn(seq)(
            [...p012, (p0, tail) => {
                expect(p0).toBe(0)
                expect(tail).toStrictEqual(seq.slice(3))
            }]
        )

    })

    test("many utility", () => {
        bjorn([0, 0, 0, ...seq])(
            [zero.many, (zero, tail) => {
                expect(zero).toStrictEqual([0, 0, 0, 0])
                expect(tail).toStrictEqual(seq.slice(1))
            }]
        )
    })
})